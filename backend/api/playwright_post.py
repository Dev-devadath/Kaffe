import asyncio
import sys
import os
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
from dotenv import load_dotenv

# Load environment variables
load_dotenv()


async def post_to_linkedin(post_text: str, image_path: str) -> str:
    """
    Post to LinkedIn with text and image using credentials from .env.
    
    Args:
        post_text: The text content for the post
        image_path: Path to the image file to upload
        
    Returns:
        The URL of the newly created post
        
    Raises:
        FileNotFoundError: If image file doesn't exist
        ValueError: If authentication fails or posting fails or credentials missing
        PlaywrightTimeoutError: If elements are not found within timeout
    """
    # Validate inputs
    linkedin_email = os.getenv("LINKEDIN_EMAIL")
    linkedin_password = os.getenv("LINKEDIN_PASSWORD")
    
    if not linkedin_email or not linkedin_password:
        raise ValueError("LINKEDIN_EMAIL and LINKEDIN_PASSWORD must be set in .env file")
    
    image_file = Path(image_path)
    if not image_file.exists():
        raise FileNotFoundError(f"Image file not found: {image_path}")
    
    if not image_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.gif', '.webp']:
        raise ValueError(f"Invalid image format: {image_file.suffix}")
    
    async with async_playwright() as p:
        # Launch browser
        browser = await p.chromium.launch(headless=False)
        
        try:
            # Create new context
            context = await browser.new_context()
            
            # Open a new tab
            page = await context.new_page()
            
            # Navigate to LinkedIn login
            await page.goto("https://www.linkedin.com/login", wait_until="networkidle")
            
            # Check if already logged in (redirects to feed)
            if "feed" not in page.url:
                # Perform login
                try:
                    # Fill email
                    await page.fill('input[name="session_key"]', linkedin_email, timeout=5000)
                    # Fill password
                    await page.fill('input[name="session_password"]', linkedin_password, timeout=5000)
                    # Click sign in button
                    await page.click('button[type="submit"]', timeout=5000)
                    
                    # Wait a bit for the page to process
                    await asyncio.sleep(3)
                    
                    # Check if we need to handle security challenge
                    current_url = page.url
                    
                    # Check for CAPTCHA or verification
                    if "checkpoint" in current_url or "challenge" in current_url:
                        print("⚠️  LinkedIn security challenge detected. Please complete it in the browser...", file=sys.stderr)
                        # Wait for user to complete challenge and reach feed
                        try:
                            await page.wait_for_url("**/feed/**", timeout=120000)  # 2 minutes
                        except PlaywrightTimeoutError:
                            raise ValueError("Security challenge not completed or login failed. Please verify manually.")
                    else:
                        # Wait for navigation to feed (shorter timeout)
                        try:
                            await page.wait_for_url("**/feed/**", timeout=15000)
                        except PlaywrightTimeoutError:
                            # Check if we're already on feed or home page
                            if "linkedin.com" in page.url and ("feed" in page.url or "mynetwork" in page.url or page.url.endswith("linkedin.com/")):
                                # Navigate to feed explicitly
                                await page.goto("https://www.linkedin.com/feed/", wait_until="networkidle")
                            else:
                                raise ValueError("Login failed. Please check your LinkedIn credentials in .env file.")
                                
                except PlaywrightTimeoutError:
                    raise ValueError("Login failed. Please check your LinkedIn credentials in .env file.")
            
            # Verify we're on the feed
            try:
                await page.wait_for_selector('[data-test-id="feed-container"]', timeout=10000)
            except PlaywrightTimeoutError:
                # Try alternative selector
                try:
                    await page.wait_for_selector('.scaffold-finite-scroll', timeout=5000)
                except PlaywrightTimeoutError:
                    raise ValueError("Authentication failed. Could not access LinkedIn feed.")
            
            # Wait for page to fully load
            await asyncio.sleep(2)
            
            # Click "Start a post" button - try multiple selectors
            post_button_selectors = [
                'button:has-text("Start a post")',
                '.share-box-feed-entry__trigger',
                'button.share-box-feed-entry__trigger',
                '[aria-label="Start a post"]',
                'button.artdeco-button:has-text("Start a post")',
                '.share-box__open',
                'button[data-test-share-box-trigger]'
            ]
            
            clicked = False
            for selector in post_button_selectors:
                try:
                    await page.wait_for_selector(selector, timeout=3000, state='visible')
                    await page.click(selector, timeout=2000)
                    clicked = True
                    break
                except PlaywrightTimeoutError:
                    continue
                except Exception:
                    continue
            
            if not clicked:
                raise ValueError("Could not find 'Start a post' button. LinkedIn layout may have changed.")
            
            # Wait for the post editor modal to appear
            try:
                await page.wait_for_selector('.share-creation-state__editor', timeout=5000)
            except PlaywrightTimeoutError:
                # Try alternative selectors
                try:
                    await page.wait_for_selector('[role="dialog"]', timeout=5000)
                except PlaywrightTimeoutError:
                    try:
                        await page.wait_for_selector('.artdeco-modal', timeout=5000)
                    except PlaywrightTimeoutError:
                        raise ValueError("Post creation modal did not appear. LinkedIn layout may have changed.")
            
            # Wait a moment for modal to fully load
            await asyncio.sleep(1.5)
            
            # Insert post text into the editor FIRST
            editor_selectors = [
                '.ql-editor[contenteditable="true"]',
                '[contenteditable="true"][role="textbox"]',
                '.share-creation-state__editor [contenteditable="true"]',
                'div[contenteditable="true"]',
                '[data-placeholder="What do you want to talk about?"]',
                '.ql-editor p'
            ]
            
            text_inserted = False
            for selector in editor_selectors:
                try:
                    editor = await page.wait_for_selector(selector, timeout=3000, state='visible')
                    await editor.click()
                    await asyncio.sleep(0.5)
                    # Try typing the text
                    await editor.type(post_text, delay=30)
                    text_inserted = True
                    break
                except PlaywrightTimeoutError:
                    continue
                except Exception as e:
                    # Try next selector
                    continue
            
            if not text_inserted:
                # Last resort: try using keyboard after clicking in the modal
                try:
                    modal = await page.wait_for_selector('[role="dialog"]', timeout=2000)
                    await modal.click()
                    await page.keyboard.type(post_text, delay=30)
                    text_inserted = True
                except Exception:
                    raise ValueError("Could not find post text editor. LinkedIn layout may have changed.")
            
            # Wait after typing text
            await asyncio.sleep(1)
            
            # Now upload image - find file input and upload
            file_input_selectors = [
                'input[type="file"][accept*="image"]',
                'input[type="file"]',
                '.share-creation-state__media-upload input[type="file"]'
            ]
            
            uploaded = False
            for selector in file_input_selectors:
                try:
                    file_input = await page.wait_for_selector(selector, timeout=3000, state='attached')
                    await file_input.set_input_files(str(image_file.absolute()))
                    uploaded = True
                    break
                except PlaywrightTimeoutError:
                    continue
            
            if not uploaded:
                # Try clicking the media button first
                media_button_selectors = [
                    'button[aria-label*="Add a photo"]',
                    'button[aria-label*="Add media"]',
                    '.share-creation-state__footer-action-button--media',
                    'button:has-text("Media")'
                ]
                
                for selector in media_button_selectors:
                    try:
                        await page.click(selector, timeout=2000)
                        await asyncio.sleep(0.5)
                        
                        # Try file input again after clicking media button
                        for input_selector in file_input_selectors:
                            try:
                                file_input = await page.wait_for_selector(input_selector, timeout=2000, state='attached')
                                await file_input.set_input_files(str(image_file.absolute()))
                                uploaded = True
                                break
                            except PlaywrightTimeoutError:
                                continue
                        
                        if uploaded:
                            break
                    except PlaywrightTimeoutError:
                        continue
            
            if not uploaded:
                raise ValueError("Could not upload image. LinkedIn layout may have changed.")
            
            # Wait for image to finish uploading and processing
            await asyncio.sleep(3)
            
            # Wait a moment for any auto-save or validation
            await asyncio.sleep(1)
            
            # Click the Post button
            post_submit_selectors = [
                'button.share-actions__primary-action:has-text("Post")',
                'button:has-text("Post"):not(:has-text("Start a post"))',
                '[aria-label="Post"]',
                '.share-actions__primary-action'
            ]
            
            posted = False
            for selector in post_submit_selectors:
                try:
                    post_button = await page.wait_for_selector(selector, timeout=3000)
                    # Check if button is enabled
                    is_disabled = await post_button.get_attribute('disabled')
                    if is_disabled is None:
                        await post_button.click()
                        posted = True
                        break
                except PlaywrightTimeoutError:
                    continue
            
            if not posted:
                raise ValueError("Could not find or click 'Post' button. LinkedIn layout may have changed.")
            
            # Wait for the post to be published and modal to close
            try:
                await page.wait_for_selector('.share-creation-state__editor', state='hidden', timeout=15000)
            except PlaywrightTimeoutError:
                # Modal might have different structure, continue anyway
                pass
            
            # Wait for navigation or success indicator
            await asyncio.sleep(3)
            
            # Look for the newly created post in the feed
            # LinkedIn typically shows a success message or the post appears at the top
            try:
                # Wait for any success notification
                await page.wait_for_selector('.artdeco-toast-item', timeout=5000)
                await asyncio.sleep(2)
            except PlaywrightTimeoutError:
                # No toast notification, continue
                pass
            
            # Try to find the most recent post (should be ours)
            # Look for post links in the feed
            post_link_selectors = [
                '.feed-shared-update-v2 a[href*="/feed/update/"]',
                'a[href*="/posts/"][href*="activity"]',
                '.feed-shared-actor__container-link'
            ]
            
            post_url = None
            for selector in post_link_selectors:
                try:
                    # Get all matching elements
                    elements = await page.query_selector_all(selector)
                    if elements:
                        # Get the first one (most recent)
                        href = await elements[0].get_attribute('href')
                        if href and ('activity' in href or 'feed/update' in href):
                            # Construct full URL if relative
                            if href.startswith('/'):
                                post_url = f"https://www.linkedin.com{href}"
                            else:
                                post_url = href
                            break
                except Exception:
                    continue
            
            # If we couldn't find the post link, try navigating to profile and getting latest post
            if not post_url:
                try:
                    # Click on user profile to go to recent activity
                    await page.click('img.global-nav__me-photo', timeout=5000)
                    await asyncio.sleep(1)
                    
                    # Look for "View Profile" link
                    await page.click('a:has-text("View Profile")', timeout=5000)
                    await page.wait_for_load_state('networkidle')
                    
                    # Find the most recent post/activity
                    activity_links = await page.query_selector_all('a[href*="activity"]')
                    if activity_links:
                        href = await activity_links[0].get_attribute('href')
                        if href:
                            post_url = href if href.startswith('http') else f"https://www.linkedin.com{href}"
                except Exception:
                    pass
            
            # If still no URL, use current page URL as fallback
            if not post_url:
                current_url = page.url
                if 'linkedin.com' in current_url:
                    post_url = current_url
                else:
                    # Return feed URL as last resort
                    post_url = "https://www.linkedin.com/feed/"
            
            return post_url
            
        finally:
            await browser.close()


async def main():
    if len(sys.argv) != 3:
        print("Error: Invalid arguments", file=sys.stderr)
        print("Usage: python playwright_post.py <post_text> <image_path>", file=sys.stderr)
        sys.exit(1)
    
    post_text = sys.argv[1]
    image_path = sys.argv[2]
    
    try:
        post_url = await post_to_linkedin(post_text, image_path)
        print(post_url)
    except FileNotFoundError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)
    except PlaywrightTimeoutError as e:
        print(f"Error: Timeout - {e}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {type(e).__name__} - {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    asyncio.run(main())
