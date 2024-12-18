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
    driver.get("http://localhost:81")  # Update with your app's URL
    print("App opened successfully!")

    # Step 2: Navigate the Home page via the navbar
    home_nav_link = driver.find_element(By.LINK_TEXT, "Home")
    home_nav_link.click()
    print("Navigated to the Home page!")
    
    # Print content of the home page
    home_content = driver.find_element(By.TAG_NAME, "body").text
    print("\n--- Home Page Content ---")
    print(home_content)
    print("-------------------------\n")
    
    # Step 3: Navigate to the Directory page
    upload_nav_link = driver.find_element(By.LINK_TEXT, "Directory")
    upload_nav_link.click()
    print("Navigated to the Directory page!")

    # Step 4: Interact with the dropdown menu
    dropdown_menu = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "searchType"))
    )
    dropdown_menu.click()
    dropdown_option = driver.find_element(By.XPATH, "//option[@value='Name']")
    dropdown_option.click()
    print("Changed dropdown selection to 'Name'.")

    # Step 5: Test the NPM Package URL text box
    npm_url_input = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "searchUrl"))
    )
    npm_url_input.send_keys("https://www.npmjs.com/package/test-package")
    print("Entered NPM Package URL!")

    # Step 6: Click the Search button
    upload_button = driver.find_element(By.XPATH, "//button[contains(text(), 'Search')]")
    upload_button.click()
    print("Clicked Search button!")

    # Step 7: Verify the status message
    search_result = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.CLASS_NAME, "search-result"))
    )
    print(f"Search Result: {search_result.text}")

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

    # Step 12: Navigate to the Options page
    upload_nav_link = driver.find_element(By.LINK_TEXT, "Options")
    upload_nav_link.click()
    print("Navigated to the Options page!")

    # Step 13: Test the Username text box
    npm_url_input = WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.ID, "Username"))
    )
    npm_url_input.send_keys("ExampleUsername")
    print("Entered Username into text box!")

     # Step 14: Test the Login Button
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

    # Step 15: Test the Tracks Button
    load_button = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.CLASS_NAME, "tracks"))
    )
    load_button.click()
    print("Tracks Button clicked!")

    # Step 16: Test the Reset Button
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
    # Step Final: Close the browser
    driver.quit()
    print("Test completed and browser closed!")
