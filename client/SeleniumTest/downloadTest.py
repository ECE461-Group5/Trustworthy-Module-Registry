# Author(s): Derek Petersen
# Purpose: Unit Test for download page on website 

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

    # Step 16: Navigate to the Download page
    upload_nav_link = driver.find_element(By.LINK_TEXT, "Download")
    upload_nav_link.click()
    print("Navigated to the Download page!")

    # Step 17: Interact with the dropdown menu
    dropdown_menu = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "searchType"))
    )
    dropdown_menu.click()
    dropdown_option = driver.find_element(By.XPATH, "//option[@value='Name']")
    dropdown_option.click()
    print("Changed dropdown selection to 'Name'.")

    # Step 18: Test the NPM Package URL text box
    npm_url_input = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "npmUrl"))
    )
    npm_url_input.send_keys("test-package-id")
    print("Entered package identifier!")

    # Step 19: Click the Download button
    download_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Download Package')]")
    download_button.click()
    print("Clicked Download Package button!")

    # Step 20: Verify the status message
    status_message = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//p[contains(text(), 'Status:')]"))
    )
    print(f"Status Message: {status_message.text}")


finally:
    # Close the browser
    driver.quit()
    print("Test completed and browser closed!")
