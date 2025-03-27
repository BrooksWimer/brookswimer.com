from flask import Flask, request, jsonify
from flask_cors import CORS
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import undetected_chromedriver as uc
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import StaleElementReferenceException
import time
import os
import logging
from flask_talisman import Talisman
import numpy as np
import jwt.utils
import math


app = Flask(__name__)
Talisman(app)
CORS(app, resources={r"/*": {"origins": "https://brookswimer.com"}})


# Global driver instance
driver = None
# Global order address variable
stored_address = None  



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
        driver = uc.Chrome(options=options)


@app.route("/")
def home():
    return "Backend is running!"  # Simple health check


@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Unhandled exception: {e}")
    return jsonify({"error": "Something went wrong. Please try again later."}), 500


@app.route("/find_stores", methods=["GET"])
def find_stores():
    global driver, stored_address
    address = request.args.get("address")
    if not address:
        return jsonify({"error": "No address provided"}), 400

    stored_address = address  # Store the received address globally
    start_driver()


    try:
        driver.get("https://www.doordash.com/tabs/grocery/")
        time.sleep(5)

        #try to click on enter address button
        try:
            possible_selectors = [
                (By.XPATH, "//button[@data-testid='addressTextButton']"),  # Best match
                (By.XPATH, "//button[@kind='BUTTON/TERTIARY']"),  # Button kind match
                (By.XPATH, "//button[contains(@class, 'styles__ButtonRoot-sc-1ldytso-0')]"),  # Class match
                (By.XPATH, "//button[span/span/span/span[text()='Your Address']]"),  # Text-based
                (By.TAG_NAME, "button")  # Last resort: any button
            ]

            element = None

            for by, selector in possible_selectors:
                try:
                    element = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((by, selector)))
                    time.sleep(1)
                    element.click()
                    app.logger.info(f"Successfully clicked on 'Your Address' button using: {selector}")
                    break  # Stop after successful click
                except Exception as e:
                    app.logger.warning(f"Failed to click using: {selector} | Error: {e}")

            if element is None:
                raise Exception("Could not find or click the 'Your Address' button.")

        except Exception as e:
            app.logger.error(f"Error clicking 'Your Address' button: {e}")
            return jsonify({"error": "Failed to click the address input button"}), 500



        #try to enter address
        try:
            possible_selectors = [
                (By.XPATH, "//input[@data-testid='AddressAutocompleteField']"),  # Best match
                (By.ID, "fieldWrapper-:r7:"),  # ID match
                (By.XPATH, "//input[contains(@class, 'Input__InputContent-sc-1o75rg4-4')]"),  # Class-based
                (By.TAG_NAME, "input")  # Last resort: any input field
            ]

            input_field = None

            for by, selector in possible_selectors:
                try:
                    input_field = WebDriverWait(driver, 5).until(EC.presence_of_element_located((by, selector)))
                    input_field.clear()
                    input_field.send_keys(address)
                    time.sleep(1)
                    input_field.send_keys(Keys.ENTER)
                    app.logger.info(f"Successfully entered address using: {selector}")
                    break  # Stop after success
                except Exception as e:
                    app.logger.warning(f"Failed to send keys using: {selector} | Error: {e}")

            if input_field is None:
                raise Exception("Could not find or enter text into the address input field.")

        except Exception as e:
            app.logger.error(f"Error entering address: {e}")
            return jsonify({"error": "Failed to enter the address"}), 500


        # try to click the safe address button
        try:
            possible_selectors = [
                (By.XPATH, "//button[@data-anchor-id='AddressEditSave']"),  # Best match (structured identifier)
                (By.XPATH, "//button[@kind='BUTTON/PRIMARY']"),  # Match by button type
                (By.XPATH, "//button[contains(@class, 'styles__ButtonRoot-sc-1ldytso-0')]"),  # Class-based match
                (By.XPATH, "//button[span/span/span/span[text()='Save']]"),  # Text-based match
                (By.TAG_NAME, "button")  # Last resort: any button
            ]

            element = None

            for by, selector in possible_selectors:
                try:
                    element = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((by, selector)))
                    time.sleep(1)
                    element.click()
                    app.logger.info(f"Successfully clicked on 'Save' button using: {selector}")
                    break  # Stop after success
                except Exception as e:
                    app.logger.warning(f"Failed to click using: {selector} | Error: {e}")

            if element is None:
                raise Exception("Could not find or click the 'Save' button.")

        except Exception as e:
            app.logger.error(f"Error clicking 'Save' button: {e}")
            return jsonify({"error": "Failed to click 'Save' button"}), 500



        time.sleep(5)

        # try to click on see all nearby stores button
        try:
            possible_selectors = [
                (By.XPATH, "//a[@data-anchor-id='SeeAll']"),  # Best match (structured identifier)
                (By.XPATH, "//a[@aria-label='see all']"),  # ARIA-label match
                (By.XPATH, "//a[contains(@class, 'styles__ButtonRoot-sc-1ldytso-0')]"),  # Class-based match
                (By.XPATH, "//a[span[contains(text(), 'See All Stores Nearby')]]"),  # Text-based match
                (By.TAG_NAME, "a")  # Last resort: any <a> link
            ]

            element = None

            for by, selector in possible_selectors:
                try:
                    element = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((by, selector)))
                    time.sleep(1)
                    element.click()
                    app.logger.info(f"Successfully clicked on 'See All' button using: {selector}")
                    break  # Stop after success
                except Exception as e:
                    app.logger.warning(f"Failed to click using: {selector} | Error: {e}")

            if element is None:
                raise Exception("Could not find or click the 'See All' button.")

        except Exception as e:
            app.logger.error(f"Error clicking 'See All' button: {e}")
            return jsonify({"error": "Failed to click 'See All' button"}), 500



        time.sleep(5)


        store_elements = WebDriverWait(driver, 20).until(
            EC.presence_of_all_elements_located((By.XPATH, "//div[contains(@id, 'store-info')]"))
        )


        stores = []
        for store in store_elements:
            try:
                store_name_element = store.find_element(By.XPATH, ".//div/span")
                store_name = store_name_element.text.strip()
                store_id_attr = store.get_attribute("id")
                store_id = store_id_attr.split("-")[-1]
                stores.append({"name": store_name, "id": store_id})
            except Exception as e:
                app.logger.error(f"Failed to extract store info: {e}")


        return jsonify({"stores": stores})


    except Exception as e:
        app.logger.error(f"Error in find_stores: {e}")
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
        driver.get(f"https://www.doordash.com/convenience/store/{store_id}/?pickup=false")
       


    except Exception as e:
        app.logger.error(f"Error in getting store URL {e}")
        return jsonify({"error": str(e)}), 500


   




    # List of potential XPaths for the button
    xpaths = ["//button[@data-testid='StorePageEntrypointCTA']", "//span[text()='Shop your list']/ancestor::button",  "/html/body/div[1]/div[1]/div[2]/main/main/div[3]/div/div/div[4]/div[2]/div[2]/div/div/button"]
    # Try multiple XPaths
    if not try_multiple_clicks(driver, xpaths):
        return jsonify({"error": "Failed to click on the 'Shop your list' button."}), 500


    textarea_xpaths = [
        "//textarea[@data-testid='ShoppingListModalItems']",  # Best match (data-testid)
        "//textarea[@name='grocery-list-items']",  # Using 'name' attribute
        "//textarea[@id='grocery-list-items']",  # Using 'id' attribute
        "//textarea[@placeholder='Add things like:']",  # Using placeholder text
        "//textarea[contains(@class, 'Input__InputContent')]",  # Partial class match
        "//textarea"  # General fallback (use as a last resort)
    ]




    try:
        time.sleep(5)
        grocery_text = ", ".join(grocery_list)
       
        # Attempt sending keys to multiple possible identifiers
        if not safe_send_keys2(driver, textarea_xpaths, grocery_text):
            raise Exception("Failed to locate and interact with the textarea.")


        time.sleep(5)
    except Exception as e:
        app.logger.error(f"Error entering grocery list: {e}")




    try:    
        possible_selectors = [
            (By.XPATH, "//button[@data-testid='ShoppingListModalContinue']"),  # Best match (data-testid)
            (By.XPATH, "//button[span/span/span/span[text()='Search all items']]"),  # Using visible text
            (By.XPATH, "//button[contains(@class, 'styles__ButtonRoot')]"),  # Partial class match
            (By.XPATH, "//button[@kind='BUTTON/PRIMARY']"),  # Using 'kind' attribute
            (By.TAG_NAME, "button")  # General fallback (use as a last resort)
        ]


        element = None


        for by, selector in possible_selectors:
            try:
                element = WebDriverWait(driver, 5).until(EC.element_to_be_clickable((by, selector)))
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)  # Ensure it's visible
                time.sleep(1)
                element.click()
                app.logger.info(f"Successfully clicked on element using: {selector}")
                break  # Stop trying after successful click
            except Exception as e:
                app.logger.warning(f"Failed to click using: {selector} | Error: {e}")


        if element is None:
            raise Exception("Could not find or click the 'Search all items' button.")


    except Exception as e:
        app.logger.error(f"Error in saving grocery list: {e}")
        return jsonify({"error": str(e)}), 500














    products = extract_product_details_with_scroll(driver)
    return jsonify({"products": products})
 
@app.route("/create_order", methods=["POST"])
def create_order():
    data = request.get_json()
    items = data.get("items", [])
    app.logger.info(f"Received items: {items}")




    # Validate and process the order
    if not items:
        return jsonify({"error": "No items provided"}), 400




    accessKey = {
        "developer_id": "c6b30377-3bbe-4ab3-b2d6-0fd3d9e352db",
        "key_id": "bd36638b-3cb9-40ee-a413-9a7fd94cebd2",
        "signing_secret": "5csUGsTO07j2o0ycHt2qTsaCk9jHA7DDn4CBCpvS4i4"
    }




    token = jwt.encode(
        {
            "aud": "doordash",
            "iss": accessKey["developer_id"],
            "kid": accessKey["key_id"],
            "exp": str(math.floor(time.time() + 300)),
            "iat": str(math.floor(time.time())),
        },
        jwt.utils.base64url_decode(accessKey["signing_secret"]),
        algorithm="HS256",
        headers={"dd-ver": "DD-JWT-V1"})




    print(token)




    import requests




    endpoint = "https://openapi.doordash.com/drive/v2/deliveries/"




    headers = {"Accept-Encoding": "application/json",
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"}




    request_body = {  # Modify pickup and drop off addresses below
        "external_delivery_id": f"D-{np.random.randint(100000, 999999)}",
        "pickup_address": "901 Market Street 6th Floor San Francisco, CA 94103",
        "pickup_business_name": "Wells Fargo SF Downtown",
        "pickup_phone_number": "+16505555555",
        "pickup_instructions": "Enter gate code 1234 on the callbox.",
        "dropoff_address": "901 Market Street 6th Floor San Francisco, CA 94103",
        "dropoff_business_name": "Wells Fargo SF Downtown",
        "dropoff_phone_number": "+16505555555",
        "dropoff_instructions": "Enter gate code 1234 on the callbox.",
        "order_value": 1999,
        "items": items
    }




    create_delivery = requests.post(endpoint, headers=headers, json=request_body)  # Create POST request




    print(create_delivery.status_code)
    print(create_delivery.text)
    print(create_delivery.reason)




    return jsonify({"message": "Order created successfully!", "order_details": create_delivery.text}), 200








   


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
            app.logger.error(f"Failed to click element: {xpath}, Error: {e}")
            time.sleep(2)
    return False


def try_multiple_clicks(driver, xpaths, retries=3):
    """
    Tries to click on multiple possible XPaths sequentially.
   
    Args:
        driver: The WebDriver instance.
        xpaths: A list of XPath strings to try.
        retries: Number of retries for each XPath.


    Returns:
        True if any XPath click succeeds, False otherwise.
    """
    for xpath in xpaths:
        for attempt in range(retries):
            try:
                # Log the attempt
                print(f"Trying to click on: {xpath} (Attempt {attempt + 1})")


                # Locate and click the element
                element = WebDriverWait(driver, 10).until(EC.element_to_be_clickable((By.XPATH, xpath)))
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
                element.click()


                # Success
                print(f"Successfully clicked on: {xpath}")
                return True
            except Exception as e:
                print(f"Failed to click on: {xpath} (Attempt {attempt + 1}). Error: {e}")
                time.sleep(2)  # Wait before retrying


    # If no clicks succeeded
    print("All attempts to click failed.")
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
            app.logger.error(f"Failed to send keys to: {xpath}, Error: {e}")
            time.sleep(2)
    return False






def extract_product_details_with_scroll(driver, retries=2):
    products = set()


    for attempt in range(retries):
        try:
            app.logger.info("Waiting for the product page to load...")
            WebDriverWait(driver, 15).until(
                EC.presence_of_all_elements_located((By.XPATH, "//div[@data-testid='price-name-info-opacity-wrapper']"))
            )


            last_height = driver.execute_script("return document.body.scrollHeight")
            scroll_attempts = 0


            while scroll_attempts < 4:  # Limit the scroll attempts to prevent infinite loops
                product_elements = WebDriverWait(driver, 5).until(
                    EC.presence_of_all_elements_located((By.XPATH, "//div[@data-testid='price-name-info-opacity-wrapper']"))
                )


                for product in product_elements:
                    try:
                        name_element = product.find_element(By.XPATH, ".//span[@data-telemetry-id='priceNameInfo.name']")
                        product_name = name_element.text.strip()
                    except:
                        print("Unknown Product")
                        product_name = "Unknown Product"


                    try:
                        price_element = product.find_element(By.XPATH, ".//div[contains(@class, 'sc-a7623aae-0')]")
                        price = price_element.text.strip().replace("\n", "")
                    except:
                        print("price not found")
                        price = "Price not found"


                    try:
                        quantity_element = product.find_element(By.XPATH, ".//span[contains(@class, 'gcHNxU')]")
                        quantity = quantity_element.text.strip()
                    except:
                        print("quantity not found")
                        quantity = "Quantity not found"


                    products.add((product_name, price, quantity))


                driver.execute_script("window.scrollBy(0, window.innerHeight);")
                app.logger.info("Scrolling down to load more products...")
                time.sleep(3)


                new_height = driver.execute_script("return document.body.scrollHeight")
                if new_height == last_height:
                    scroll_attempts += 1  # Increment scroll attempts if no change
                else:
                    scroll_attempts = 0  # Reset if new content is loaded
                last_height = new_height


                if scroll_attempts >= 2:
                    app.logger.info("Stopping scrolling after 5 attempts with no new content.")
                    break


            product_list = [{"name": name, "price": price, "quantity": quantity} for name, price, quantity in products]
            print(product_list)
            driver.quit()
            return product_list
           


        except Exception as e:
            app.logger.error(f"[Attempt {attempt + 1}] Failed to extract product details: {e}")
            product_list = [{"name": name, "price": price, "quantity": quantity} for name, price, quantity in products]
            print(product_list)
            driver.quit()
            return product_list
            time.sleep(2)


    return []




def safe_send_keys2(driver, xpaths, text, retries=3):
    """
    Tries to locate and input text into a textarea using multiple possible XPaths.
   
    Args:
        driver: Selenium WebDriver instance.
        xpaths: List of possible XPaths to try.
        text: The text to enter into the input field.
        retries: Number of retry attempts for each XPath.


    Returns:
        True if successful, False otherwise.
    """
    for xpath in xpaths:
        for attempt in range(retries):
            try:
                app.logger.info(f"Attempting to send keys to: {xpath} (Attempt {attempt + 1})")
               
                # Wait for presence
                input_field = WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, xpath)))


                # Ensure element is in the viewport
                driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", input_field)
                time.sleep(1)


                # Clear and send keys
                input_field.clear()
                input_field.send_keys(text)
                time.sleep(2)
                input_field.send_keys(Keys.ENTER)
                time.sleep(3)


                app.logger.info(f"Successfully sent keys to: {xpath}")
                return True
            except Exception as e:
                app.logger.error(f"Failed to send keys to: {xpath} (Attempt {attempt + 1}), Error: {e}")
                time.sleep(2)


    app.logger.error("All attempts to send keys failed.")
    return False








if __name__ == "__main__":
    base_dir = os.path.abspath(os.path.dirname(__file__))
    cert_path = os.path.join(base_dir, "origin_cert.pem")
    key_path = os.path.join(base_dir, "private_key.pem")


    app.run(host='0.0.0.0', port=443, ssl_context=(cert_path, key_path))




