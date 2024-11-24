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
    # Step 1: Open localhost
    driver.get("http://localhost:3000")  # Update with your app's URL
    print("App opened successfully!")

    # Step 2: Locate the input text box and type a value
    search_box = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "service-text-field"))
    )
    search_box.send_keys("this is a test package")
    print("Input entered successfully!")

    # Step 3: Locate the submit button and click it
    submit_button = driver.find_element(By.CLASS_NAME, "service-button")
    submit_button.click()
    print("Submit button clicked!")

    # Step 4: Handle the alert and print its text
    WebDriverWait(driver, 10).until(EC.alert_is_present())
    alert = driver.switch_to.alert
    alert_text = alert.text
    print(f"Alert Text: {alert_text}")
    alert.accept()  # Close the alert box

    # Step 5: Print the current page title
    print(f"Page Title: {driver.title}")

finally:
    # Step 6: Close the browser
    driver.quit()
    print("Test completed and browser closed!")
