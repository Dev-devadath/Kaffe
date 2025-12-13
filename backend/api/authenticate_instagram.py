import asyncio
import os
from playwright.async_api import async_playwright
from dotenv import load_dotenv

load_dotenv()


async def authenticate_instagram():
    """
    Authenticate with Instagram and save session to instagram_auth.json.
    This only needs to be run once.
    """
    instagram_username = os.getenv("INSTAGRAM_USERNAME")
    instagram_password = os.getenv("INSTAGRAM_PASSWORD")
    
    if not instagram_username or not instagram_password:
        print("Error: INSTAGRAM_USERNAME and INSTAGRAM_PASSWORD must be set in .env file")
        return
    
    async with async_playwright() as p:
        # Launch with stealth settings
        browser = await p.firefox.launch(
            headless=False,
            firefox_user_prefs={
                'dom.webdriver.enabled': False,
                'useAutomationExtension': False
            }
        )
        
        context = await browser.new_context(
            viewport={'width': 1366, 'height': 768},
            user_agent='Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/115.0',
            locale='en-US',
            timezone_id='America/New_York'
        )
        
        page = await context.new_page()
        
        print("→ Navigating to Instagram...")
        await page.goto("https://www.instagram.com/")
        await asyncio.sleep(5)
        
        print("\n⚠️  MANUAL LOGIN REQUIRED")
        print("→ Please log in manually in the browser window that opened")
        print("→ Complete any 2FA/verification if prompted")
        print("→ Once you see your Instagram feed/home page, come back here")
        
        input("\nPress Enter after you've successfully logged in and see your feed...")
        
        await asyncio.sleep(2)
        
        # Verify login was successful
        current_url = page.url
        if "login" in current_url or current_url == "https://www.instagram.com/":
            # Navigate to check if logged in
            await page.goto("https://www.instagram.com/", wait_until="networkidle")
            await asyncio.sleep(2)
        
        if "login" in page.url:
            print("\n❌ Still on login page. Please try again.")
            await browser.close()
            return
        
        print("\n✓ Login verified!")
        
        # Save the authenticated session
        await context.storage_state(path="instagram_auth.json")
        
        print("✓ Authentication saved to instagram_auth.json")
        print("\nYou can now use instagram_poster.py without logging in again!")
        
        await browser.close()


if __name__ == "__main__":
    asyncio.run(authenticate_instagram())
