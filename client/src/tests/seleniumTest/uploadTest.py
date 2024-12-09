# Author(s): Derek Petersen
# Purpose: Unit Test for Upload page on website 

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
    driver.get("http://localhost:81")  # Update with the correct port if necessary
    print("React app opened successfully!")   

    # Step 8: Navigate to the Upload page
    upload_nav_link = driver.find_element(By.LINK_TEXT, "Upload")
    upload_nav_link.click()
    print("Navigated to the Upload page!")

    # Step 9: Test the NPM Package URL text box
    npm_url_input = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "npmUrl"))
    )
    npm_url_input.send_keys("https://www.npmjs.com/package/test-package")
    print("Entered NPM Package URL!")

    # Step 10: Click the Upload Package button
    upload_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Upload Package')]")
    upload_button.click()
    print("Clicked Upload Package button!")

    # Step 11: Verify the status message
    status_message = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//p[contains(text(), 'Status:')]"))
    )
    print(f"Status Message: {status_message.text}")

    
finally:
    # Close the browser
    driver.quit()
    print("Test completed and browser closed!")


# Expected Result --------------------
#
# React app opened successfully!
# Navigated to the Upload page!
# Entered NPM Package URL!
# Clicked Upload Package button!
# Status Message: Status: Success
# Test completed and browser closed!