from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import undetected_chromedriver as uc
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import StaleElementReferenceException
from webdriver_manager.chrome import ChromeDriverManager
import time
import os
from waitress import serve
from flask_talisman import Talisman




app = Flask(__name__)
Talisman(app)
CORS(app, resources={r"/*": {"origins": "https://brookswimer.com"}})




# Global driver instance
driver = None




def start_driver():
    global driver
    if not driver:
        options = uc.ChromeOptions()
        options.add_argument("--incognito")
        options.add_argument("--disable-blink-features=AutomationControlled")
        options.add_argument("--no-sandbox")
        options.add_argument("--disable-gpu")
        options.add_argument("--disable-dev-shm-usage")
        options.add_argument("--disable-extensions")
        options.add_argument("--window-size=1920,1080")
        options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
        driver = uc.Chrome(options=options, driver_executable_path=ChromeDriverManager().install())




@app.route("/")
def home():
    return "Backend is running!"  # Simple health check




def safe_click(driver, xpath, retries=3):
    for attempt in range(retries):
        try:
            element = WebDriverWait(driver, 60).until(EC.element_to_be_clickable((By.XPATH, xpath)))
            driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
            time.sleep(1)
            element.click()
            return True
        except StaleElementReferenceException:
            time.sleep(2)
        except Exception as e:
            print(f"Failed to click element: {xpath}, Error: {e}")
            time.sleep(2)
    return False




def safe_send_keys(driver, xpath, text, retries=3):
    for attempt in range(retries):
        try:
            input_field = WebDriverWait(driver, 60).until(EC.presence_of_element_located((By.XPATH, xpath)))
            input_field.clear()
            input_field.send_keys(text)
            time.sleep(2)
            input_field.send_keys(Keys.ENTER)
            time.sleep(3)
            return True
        except Exception as e:
            print(f"Failed to send keys to: {xpath}, Error: {e}")
            time.sleep(2)
    return False




@app.route("/find_stores", methods=["GET"])
def find_stores():
    global driver
    address = request.args.get("address")
    if not address:
        return jsonify({"error": "No address provided"}), 400




    start_driver()




    try:
        driver.get("https://www.doordash.com/tabs/grocery/")
        time.sleep(5)




        if not safe_click(driver, "/html/body/div[1]/div[1]/div[2]/main/main/header/div/div[2]/div[2]/div[1]/div/button/span/span/span[1]"):
            return jsonify({"error": "Failed to click the address input button"}), 500




        if not safe_send_keys(driver, "/html/body/div[1]/div[2]/div/div/div[2]/div/div/div[1]/div[1]/div/div[1]/div/div/div[2]/div/div[2]/input", address):
            return jsonify({"error": "Failed to enter the address"}), 500




        if not safe_click(driver, "/html/body/div[1]/div[2]/div/div/div[2]/div/div/div[1]/div/div/div[6]/button[2]"):
            return jsonify({"error": "Failed to click 'Save' button"}), 500




        time.sleep(5)




        if not safe_click(driver, "//a[@aria-label='see all']"):
            return jsonify({"error": "Failed to click 'See All' button"}), 500




        time.sleep(10)




        # Extract both store names and IDs
        store_elements = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@id, 'store-info')]"))
        )




        stores = []
        for store in store_elements:
            try:
                store_name_element = store.find_element(By.XPATH, ".//div/span")
                store_name = store_name_element.text.strip()
                store_id_attr = store.get_attribute("id")  # e.g., "store-info-27551630"
                store_id = store_id_attr.split("-")[-1]    # Extract "27551630"
                stores.append({"name": store_name, "id": store_id})
            except Exception as e:
                print(f"Failed to extract store info: {e}")




        return jsonify({"stores": stores})




    except Exception as e:
        return jsonify({"error": str(e)}), 500




@app.route("/select_store", methods=["POST"])
def select_store():
    global driver
    data = request.get_json()
    store_id = data.get("store_id")
    grocery_list = data.get("grocery_list")




    if not store_id or not grocery_list:
        return jsonify({"error": "Store ID or grocery list missing."}), 400




    try:
        # Navigate to the selected store's page using store ID
        driver.get(f"https://www.doordash.com/convenience/store/{store_id}/?pickup=false")
        time.sleep(5)


        #click on grocery list
        element = WebDriverWait(driver, 20).until(
        EC.element_to_be_clickable((By.XPATH, "/html/body/div[1]/div/div[1]/div/div[3]/div[1]/main/div[1]/div/div/div[4]/div/div[2]/div[1]/div[2]/div/div[2]/div[2]/div/div/button/span/span/span[2]/span"))
        )
        element.click()




        time.sleep(5)
        # Input the grocery list
        input_field_xpath = "/html/body/div[1]/div/div[1]/div/div[3]/div[1]/main/div[4]/div[2]/div/div[2]/div[1]/div[2]/div/div[2]/div/div/div/div/textarea"
        grocery_text = ", ".join(grocery_list)
        safe_send_keys(driver, input_field_xpath, grocery_text)
        time.sleep(5)


        #click "search all items"
        element = WebDriverWait(driver, 5).until(
        EC.element_to_be_clickable((By.XPATH,
                                    "/html/body/div[1]/div/div[1]/div/div[3]/div[1]/main/div[4]/div[2]/div/div[2]/div[2]/div/div/button/span/span/span/span"))
        )
        element.click()






        # Extract product details after searching
        products = extract_product_details_with_scroll(driver)
        return jsonify({"products": products})




    except Exception as e:
        return jsonify({"error": str(e)}), 500








def extract_product_details_with_scroll(driver, retries=1):
   """
   Extracts product name, price, and quantity by scrolling through the entire page until all products are loaded.
   """
   products = set()  # Use a set to avoid duplicates




   for attempt in range(retries):
       try:
           print("Waiting for the product page to load...")
           time.sleep(3)  # Initial wait to ensure the page loads




           last_height = driver.execute_script("return document.body.scrollHeight")




           while True:
               # Locate all product containers
               product_elements = WebDriverWait(driver, 5).until(
                   EC.presence_of_all_elements_located(
                       (By.XPATH, "//div[@data-testid='price-name-info-opacity-wrapper']"))
               )




               for product in product_elements:
                   # Extract product name
                   try:
                       name_element = product.find_element(By.XPATH,
                                                           ".//span[@data-telemetry-id='priceNameInfo.name']")
                       product_name = name_element.text.strip()
                   except:
                       product_name = "Unknown Product"




                   # Extract price
                   try:
                       price_element = product.find_element(By.XPATH, ".//div[contains(@class, 'sc-a7623aae-0')]")
                       price = price_element.text.strip().replace("\n", "")
                   except:
                       price = "Price not found"




                   # Extract quantity
                   try:
                       quantity_element = product.find_element(By.XPATH, ".//span[contains(@class, 'gcHNxU')]")
                       quantity = quantity_element.text.strip()
                   except:
                       quantity = "Quantity not found"




                   print((product_name, price, quantity))




                   # Add the product details as a tuple to avoid duplicates
                   products.add((product_name, price, quantity))




               # Scroll down the page
               driver.execute_script("window.scrollBy(0, window.innerHeight);")
               print("Scrolling down to load more products...")
               time.sleep(3)  # Wait for new products to load




               # Check if we've reached the bottom of the page
               new_height = driver.execute_script("return document.body.scrollHeight")
               if new_height == last_height:
                   print("Reached the bottom of the page.")
                   break  # Exit the loop if no more content is loading
               last_height = new_height




           # Print all collected products
           print("\n--- Collected Products ---")
           for name, price, quantity in products:
               print(f"Product: {name}\nPrice: {price}\nQuantity: {quantity}\n{'-' * 40}")




           return products




       except Exception as e:
           print(f"[Attempt {attempt + 1}] Failed to extract product details: {e}")
           time.sleep(2)




   return products






if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.dirname(__file__))
    cert_path = os.path.join(base_dir, "origin_cert.pem")
    key_path = os.path.join(base_dir, "private_key.pem")
    app.run(host='0.0.0.0', port=443, ssl_context=(cert_path, key_path))















