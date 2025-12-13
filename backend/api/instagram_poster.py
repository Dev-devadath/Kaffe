import asyncio
import sys
import os
from pathlib import Path
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError
from dotenv import load_dotenv

load_dotenv()


async def login_to_instagram(page) -> None:
    instagram_username = os.getenv("INSTAGRAM_USERNAME")
    instagram_password = os.getenv("INSTAGRAM_PASSWORD")
    
    if not instagram_username or not instagram_password:
        raise ValueError("INSTAGRAM_USERNAME and INSTAGRAM_PASSWORD must be set in .env file")
    
    await page.goto("https://www.instagram.com/accounts/login/", wait_until="networkidle")
    await asyncio.sleep(2)
    
    try:
        username_input = await page.wait_for_selector('input[name="username"]', timeout=5000)
        await username_input.fill(instagram_username)
    except:
        raise ValueError("Could not find username input field")
    
    try:
        password_input = await page.wait_for_selector('input[name="password"]', timeout=5000)
        await password_input.fill(instagram_password)
    except:
        raise ValueError("Could not find password input field")
    
    await asyncio.sleep(0.5)
    
    login_button_selectors = [
        'button[type="submit"]',
        'button:has-text("Log in")',
        'button:has-text("Log In")'
    ]
    
    for selector in login_button_selectors:
        try:
            await page.click(selector, timeout=3000)
            break
        except:
            continue
    
    await asyncio.sleep(5)
    
    try:
        await page.wait_for_selector('button:has-text("Not Now")', timeout=5000, state='visible')
        await page.click('button:has-text("Not Now")')
        await asyncio.sleep(1)
    except:
        pass
    
    try:
        await page.wait_for_selector('button:has-text("Not Now")', timeout=5000, state='visible')
        await page.click('button:has-text("Not Now")')
        await asyncio.sleep(1)
    except:
        pass
    
    if "login" in page.url or "challenge" in page.url:
        raise ValueError("Login failed. Please check your Instagram credentials in .env file")


async def post_to_instagram(caption_text: str, image_path: str) -> str:
    auth_file = Path("instagram_auth.json")
    if not auth_file.exists():
        raise FileNotFoundError("instagram_auth.json not found. Please run authenticate_instagram.py first.")
    
    image_file = Path(image_path)
    if not image_file.exists():
        raise FileNotFoundError(f"Image file not found: {image_path}")
    
    if not image_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp']:
        raise ValueError(f"Invalid image format: {image_file.suffix}")
    
    async with async_playwright() as p:
        browser = await p.firefox.launch(
            headless=False,
            firefox_user_prefs={
                'dom.webdriver.enabled': False,
                'useAutomationExtension': False
            }
        )
        
        try:
            context = await browser.new_context(
                storage_state="instagram_auth.json",
                viewport={'width': 1366, 'height': 768},
                user_agent='Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
                locale='en-US',
                timezone_id='America/New_York'
            )
            page = await context.new_page()
            
            await page.goto("https://www.instagram.com/", timeout=60000)
            await asyncio.sleep(3)
            
            # Click Create button
            print("→ Clicking Create button...", file=sys.stderr)
            create_button_selectors = [
                'a[href="#"]>svg[aria-label="New post"]',
                'a[href="#"]>svg[aria-label="Create"]',
                'svg[aria-label="New post"]',
                'svg[aria-label="Create"]',
                'a:has-text("Create")',
                '[aria-label="New post"]',
                '[aria-label="Create"]'
            ]
            
            clicked = False
            for selector in create_button_selectors:
                try:
                    await page.click(selector, timeout=3000)
                    clicked = True
                    print("→ Create button clicked", file=sys.stderr)
                    break
                except:
                    continue
            
            if not clicked:
                raise ValueError("Could not find Create button")
            
            await asyncio.sleep(2)
            
            # Click "Select from computer" button
            print("→ Looking for 'Select from computer' button...", file=sys.stderr)
            select_computer_selectors = [
                'button:has-text("Select from computer")',
                'button:has-text("Select From Computer")',
                ':has-text("Select from computer")',
                'button[type="button"]:has-text("Select")'
            ]
            
            select_clicked = False
            for selector in select_computer_selectors:
                try:
                    await page.click(selector, timeout=3000)
                    select_clicked = True
                    print("→ 'Select from computer' clicked", file=sys.stderr)
                    break
                except:
                    continue
            
            if not select_clicked:
                print("→ 'Select from computer' button not found, trying direct file input...", file=sys.stderr)
            
            await asyncio.sleep(1)
            
            await asyncio.sleep(1)
            
            # Upload image via file input
            print("→ Uploading image...", file=sys.stderr)
            file_input_selectors = [
                'input[type="file"][accept*="image"]',
                'input[type="file"]'
            ]
            
            uploaded = False
            for selector in file_input_selectors:
                try:
                    file_input = await page.wait_for_selector(selector, timeout=5000, state='attached')
                    await file_input.set_input_files(str(image_file.absolute()))
                    uploaded = True
                    print("→ Image uploaded successfully", file=sys.stderr)
                    break
                except:
                    continue
            
            if not uploaded:
                raise ValueError("Could not upload image")
            
            await asyncio.sleep(3)
            
            # Click Next buttons to go through crop/filter screens
            print("→ Navigating through editing screens...", file=sys.stderr)
            next_button_selectors = [
                'button:has-text("Next")',
                'button:has-text("Crop")'
            ]
            
            for i in range(3):
                next_clicked = False
                for selector in next_button_selectors:
                    try:
                        await page.click(selector, timeout=3000)
                        next_clicked = True
                        print(f"→ Clicked Next (step {i+1})", file=sys.stderr)
                        await asyncio.sleep(2)
                        break
                    except:
                        continue
                
                if not next_clicked:
                    print(f"→ No more Next buttons (reached caption screen)", file=sys.stderr)
                    break
            
            # Enter caption/description
            print("→ Entering caption...", file=sys.stderr)
            caption_selectors = [
                'textarea[aria-label*="caption"]',
                'textarea[placeholder*="caption"]',
                'div[contenteditable="true"][aria-label*="caption"]',
                'textarea[aria-label="Write a caption..."]'
            ]
            
            caption_filled = False
            for selector in caption_selectors:
                try:
                    caption_input = await page.wait_for_selector(selector, timeout=5000, state='visible')
                    await caption_input.click()
                    await asyncio.sleep(0.5)
                    await caption_input.fill(caption_text)
                    caption_filled = True
                    print("→ Caption entered", file=sys.stderr)
                    break
                except:
                    continue
            
            if not caption_filled:
                print("→ Caption input not found, trying keyboard...", file=sys.stderr)
                try:
                    await page.keyboard.type(caption_text, delay=50)
                    caption_filled = True
                except:
                    pass
            
            await asyncio.sleep(1)
            
            # Click Share button to publish
            print("→ Publishing post...", file=sys.stderr)
            share_button_selectors = [
                'button:has-text("Share")',
                'button:has-text("Post")'
            ]
            
            shared = False
            for selector in share_button_selectors:
                try:
                    await page.click(selector, timeout=5000)
                    shared = True
                    print("→ Share button clicked", file=sys.stderr)
                    break
                except:
                    continue
            
            if not shared:
                raise ValueError("Could not find Share button")
            
            print("→ Waiting for post to complete...", file=sys.stderr)
            await asyncio.sleep(5)
            
            try:
                await page.wait_for_selector('img[alt*="Photo"]', timeout=10000)
            except:
                pass
            
            post_url = page.url
            
            if "instagram.com" in post_url and "/p/" in post_url:
                return post_url
            
            try:
                profile_link = await page.wait_for_selector('a[href*="/p/"]', timeout=5000)
                href = await profile_link.get_attribute('href')
                if href:
                    return f"https://www.instagram.com{href}" if href.startswith('/') else href
            except:
                pass
            
            return page.url
            
        finally:
            await browser.close()


async def main():
    if len(sys.argv) != 3:
        print("Error: Invalid arguments", file=sys.stderr)
        print("Usage: python instagram_poster.py <caption_text> <image_path>", file=sys.stderr)
        sys.exit(1)
    
    caption_text = sys.argv[1]
    image_path = sys.argv[2]
    
    try:
        post_url = await post_to_instagram(caption_text, image_path)
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
