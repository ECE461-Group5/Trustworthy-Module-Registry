# Author(s): Derek Petersen
# Purpose: Unit Test for Home page on website 

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

    # Step 2: Navigate the Home page via the navbar
    home_nav_link = driver.find_element(By.LINK_TEXT, "Home")
    home_nav_link.click()
    print("Navigated to the Home page!")
    
    # Print content of the home page
    home_content = driver.find_element(By.TAG_NAME, "body").text
    print("\n--- Home Page Content ---")
    print(home_content)
    print("-------------------------\n")


finally:
    # Close the browser
    driver.quit()
    print("Test completed and browser closed!")
