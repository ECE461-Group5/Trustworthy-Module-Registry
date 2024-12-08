# Author(s): Derek Petersen
# Purpose: Unit Test for Search page on website 

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


options = Options()
options.add_argument("--log-level=3")  # Suppress unnecessary logs
options.add_argument("--ignore-certificate-errors")  # Ignore SSL certificate errors

# Set up WebDriver
service = Service("C:/Users/Derek/Desktop/SeleTest/chromedriver-win64/chromedriver-win64/chromedriver.exe")  # Replace with your chromedriver path
driver = webdriver.Chrome(service=service, options=options)

try:
    # Step 1: Open localhost React app
    driver.get("http://localhost:3001")  # Update with the correct port if necessary
    print("React app opened successfully!")   

    # Step 12: Navigate to the Search page
    upload_nav_link = driver.find_element(By.LINK_TEXT, "Search")
    upload_nav_link.click()
    print("Navigated to the Search page!")

    # Step 13: Test the NPM Package URL text box
    npm_url_input = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "searchUrl"))
    )
    npm_url_input.send_keys("https://www.npmjs.com/package/test-package")
    print("Entered NPM Package URL!")

    # Step 14: Click the Search button
    upload_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Search')]")
    upload_button.click()
    print("Clicked Search button!")

    # Step 15: Verify the status message
    search_result = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "search-result"))
    )
    print(f"Search Result: {search_result.text}")


finally:
    # Close the browser
    driver.quit()
    print("Test completed and browser closed!")
