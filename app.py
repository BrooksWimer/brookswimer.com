from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import undetected_chromedriver as uc
from selenium.webdriver.common.keys import Keys
import time
import os 

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend is running!"  # Simple health check

def safe_click(driver, xpath, retries=3):
    """Safely click an element with retries to handle stale elements."""
    for attempt in range(retries):
        try:
            element = WebDriverWait(driver, 20).until(
                EC.element_to_be_clickable((By.XPATH, xpath))
            )
            element.click()
            return True
        except Exception as e:
            print(f"[Attempt {attempt + 1}] Failed to click element: {xpath}, Error: {e}")
            time.sleep(2)  # Wait and retry
    return False

def safe_send_keys(driver, xpath, text, retries=3):
    """Safely send keys to an input field with retries."""
    for attempt in range(retries):
        try:
            input_field = WebDriverWait(driver, 20).until(
                EC.presence_of_element_located((By.XPATH, xpath))
            )
            input_field.clear()
            input_field.send_keys(text)
            time.sleep(3)
            input_field.send_keys(Keys.ENTER)
            return True
        except Exception as e:
            print(f"[Attempt {attempt + 1}] Failed to send keys to: {xpath}, Error: {e}")
            time.sleep(2)
    return False

@app.route("/find_stores", methods=["GET"])
def find_stores():
    address = request.args.get("address")
    if not address:
        return jsonify({"error": "No address provided"}), 400

    # Updated Chrome Options for Heroku
    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--remote-debugging-port=9222")

    #driver = uc.Chrome(options=options)
    chrome_path = "/app/.chromedriver/bin/chromedriver"
    chrome_bin = "/app/.apt/usr/bin/google-chrome"

    options.binary_location = chrome_bin
    driver = uc.Chrome(executable_path=chrome_path, options=options)

    try:
        driver.get("https://www.doordash.com/tabs/grocery")

        # Click the address input button
        if not safe_click(driver, "/html/body/div[1]/div[1]/div[2]/main/main/header/div/div[2]/div[2]/div[1]/div/button/span/span/span[2]/span/div/div/span"):
            return jsonify({"error": "Failed to click the address input button"}), 500

        # Enter the address
        if not safe_send_keys(driver, "/html/body/div[1]/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div/div[1]/div/div/div[2]/div/div[2]/input", address):
            return jsonify({"error": "Failed to enter the address"}), 500

        # Click the "Save" button
        if not safe_click(driver, "/html/body/div[1]/div[2]/div/div/div[2]/div/div/div[1]/div/div/div[6]/button[2]"):
            return jsonify({"error": "Failed to click the save button"}), 500

        # Click the "See All" button
        if not safe_click(driver, "//a[@aria-label='see all']"):
            return jsonify({"error": "Failed to click the 'See All' button"}), 500

        # wait for store names to load
        time.sleep(5)

        # Wait for store list to load
        store_elements = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@id, 'store-info')]/div/span"))
        )


        # Extract store names
        stores = [{"name": store.text} for store in store_elements]

        return jsonify({"stores": stores})

    except Exception as e:
        import traceback
        print("Error occurred:", e)
        traceback.print_exc()  # Debugging full error trace
        return jsonify({"error": str(e)}), 500

    finally:
        driver.quit()

if __name__ == "__main__":
    app.run(debug=True)
