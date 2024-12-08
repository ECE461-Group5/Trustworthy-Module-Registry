# Author(s): Derek Petersen
# Purpose: Unit Test for Options page on website 

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

    # Step 3: Navigate to the Options page
    options_nav_link = driver.find_element(By.LINK_TEXT, "Options")
    options_nav_link.click()
    print("Navigated to the Options page!")

    # Step 4: Test the Delete Button
    delete_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "primary-button"))
    )
    delete_button.click()
    print("Delete Button clicked!")

    # Handle the alert after clicking Delete Button
    alert = WebDriverWait(driver, 10).until(EC.alert_is_present())
    alert_text = alert.text
    print(f"Alert Text: {alert_text}")
    alert.accept()  # Close the alert
    print("Alert handled successfully!")

    # Step 5: Test the Load Registry Button
    load_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "load-button"))
    )
    load_button.click()
    print("Load Registry Button clicked!")

    # Handle the alert after clicking Delete Button
    alert = WebDriverWait(driver, 10).until(EC.alert_is_present())
    alert_text = alert.text
    print(f"Alert Text: {alert_text}")
    alert.accept()  # Close the alert
    print("Alert handled successfully!")

    # Step 6: Test the Reset Button
    load_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "reset-button"))
    )
    load_button.click()
    print("Reset Button clicked!")

    # Handle the alert after clicking Reset Button
    alert = WebDriverWait(driver, 10).until(EC.alert_is_present())
    alert_text = alert.text
    print(f"Alert Text: {alert_text}")
    alert.accept()  # Close the alert
    print("Alert handled successfully!")

    # Step 7: Test the Put Button
    load_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "put-button"))
    )
    load_button.click()
    print("Put Button clicked!")

    # Handle the alert after clicking Delete Button
    alert = WebDriverWait(driver, 10).until(EC.alert_is_present())
    alert_text = alert.text
    print(f"Alert Text: {alert_text}")
    alert.accept()  # Close the alert
    print("Alert handled successfully!")


finally:
    # Close the browser
    driver.quit()
    print("Test completed and browser closed!")
