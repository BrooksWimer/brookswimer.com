from flask import Flask, request, jsonify, render_template
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import undetected_chromedriver as uc
import time

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/find_stores", methods=["GET"])
def find_stores():
    address = request.args.get("address")
    if not address:
        return jsonify({"error": "No address provided"}), 400

    options = uc.ChromeOptions()
    options.add_argument("--headless")  # Run in headless mode for Heroku
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = uc.Chrome(options=options)

    try:
        driver.get("https://www.doordash.com/tabs/grocery")

        # Click address input
        address_button = WebDriverWait(driver, 20).until(
            EC.element_to_be_clickable((By.XPATH,
                "/html/body/div[1]/div[1]/div[2]/main/main/header/div/div[2]/div[2]/div[1]/div/button/span/span/span[2]/span/div/div/span"))
        )
        address_button.click()
        time.sleep(5)

        # Enter the address
        address_input = WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.XPATH,
                "/html/body/div[1]/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div/div[1]/div/div/div[2]/div/div[2]/input"))
        )
        address_input.clear()
        address_input.send_keys(address)
        time.sleep(2)
        address_input.send_keys(Keys.ENTER)
        time.sleep(5)

        # Click "Save"
        save_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div[2]/div/div/div[2]/div/div/div[1]/div/div/div[6]/button[2]"))
        )
        save_button.click()
        time.sleep(5)

        # Collect store names
        store_elements = WebDriverWait(driver, 10).until(
            EC.presence_of_all_elements_located(
                (By.XPATH, "//div[contains(@id, 'store-info')]/div/span")
            )
        )

        stores = [{"name": store.text} for store in store_elements]

        return jsonify({"stores": stores})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        driver.quit()

if __name__ == "__main__":
    app.run(debug=True)

