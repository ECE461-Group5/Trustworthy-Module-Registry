# Author(s): Derek Petersen
# Purpose: Unit Test for Directory page on website 

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

    # Step 16: Navigate to the Options page
    upload_nav_link = driver.find_element(By.LINK_TEXT, "Options")
    upload_nav_link.click()
    print("Navigated to the Options page!")

    # Step 13: Test the Username text box
    npm_url_input = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "Username"))
    )
    npm_url_input.send_keys("ExampleUsername")
    print("Entered Username into text box!")

     # Step 5: Test the Login Button
    load_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "login"))
    )
    load_button.click()
    print("Load Registry Button clicked!")

    # Handle the alert after clicking Login Button
    alert = WebDriverWait(driver, 10).until(EC.alert_is_present())
    alert_text = alert.text
    print(f"Alert Text: {alert_text}")
    alert.accept()  # Close the alert
    print("Alert handled successfully!")

    # Step 5: Test the Tracks Button
    load_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "tracks"))
    )
    load_button.click()
    print("Tracks Button clicked!")

    # Step 5: Test the Reset Button
    load_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "reset"))
    )
    load_button.click()
    print("Reset Button clicked!")

    # Handle the alert after clicking Login Button
    alert = WebDriverWait(driver, 10).until(EC.alert_is_present())
    alert_text = alert.text
    print(f"Alert Text: {alert_text}")
    alert.accept()  # Close the alert
    print("Alert handled successfully!")

finally:
    # Close the browser
    driver.quit()
    print("Test completed and browser closed!")

    # Expected Output --------------------
    # React app opened successfully!
    # Navigated to the Options page!
    # Entered Username into text box!
    # Load Registry Button clicked!
    # Alert Text: Login Clicked!
    # Alert handled successfully!
    # Tracks Button clicked!
    # Reset Button clicked!
    # Alert Text: Reset the registry.
    # Alert handled successfully!
    # Test completed and browser closed!