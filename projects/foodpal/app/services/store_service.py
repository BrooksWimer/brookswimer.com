from ..utils.selenium_utils import (
    safe_click, try_multiple_clicks, safe_send_keys, safe_send_keys2,
    wait_for_element, wait_for_elements
)
from selenium.webdriver.common.by import By
import time
import logging
from flask import current_app

logger = logging.getLogger(__name__)

class StoreService:
    def __init__(self, driver_service):
        self.driver_service = driver_service
        self.driver = driver_service.get_driver()
    
    def find_stores(self, address):
        """Find stores near the given address."""
        try:
            self.driver.get("https://www.doordash.com/tabs/grocery/")
            time.sleep(5)
            
            # Click address button
            address_button_selectors = [
                "//button[@data-testid='addressTextButton']",
                "//button[@kind='BUTTON/TERTIARY']",
                "//button[contains(@class, 'styles__ButtonRoot-sc-1ldytso-0')]",
                "//button[span/span/span/span[text()='Your Address']]",
                "//button"
            ]
            
            if not try_multiple_clicks(self.driver, address_button_selectors):
                raise Exception("Could not find or click the 'Your Address' button")
            
            # Enter address
            address_input_selectors = [
                "//input[@data-testid='AddressAutocompleteField']",
                "//input[@id='fieldWrapper-:r7:']",
                "//input[contains(@class, 'Input__InputContent-sc-1o75rg4-4')]",
                "//input"
            ]
            
            if not safe_send_keys2(self.driver, address_input_selectors, address):
                raise Exception("Could not find or enter text into the address input field")
            
            # Click save button
            save_button_selectors = [
                "//button[@data-anchor-id='AddressEditSave']",
                "//button[@kind='BUTTON/PRIMARY']",
                "//button[contains(@class, 'styles__ButtonRoot-sc-1ldytso-0')]",
                "//button[span/span/span/span[text()='Save']]",
                "//button"
            ]
            
            if not try_multiple_clicks(self.driver, save_button_selectors):
                raise Exception("Could not find or click the 'Save' button")
            
            time.sleep(5)
            
            # Click see all stores button
            see_all_selectors = [
                "//a[@data-anchor-id='SeeAll']",
                "//a[@aria-label='see all']",
                "//a[contains(@class, 'styles__ButtonRoot-sc-1ldytso-0')]",
                "//a[span[contains(text(), 'See All Stores Nearby')]]",
                "//a"
            ]
            
            if not try_multiple_clicks(self.driver, see_all_selectors):
                raise Exception("Could not find or click the 'See All Stores' button")
            
            # Extract store information
            stores = self._extract_store_info()
            return stores
            
        except Exception as e:
            logger.error(f"Error finding stores: {str(e)}")
            raise
    
    def _extract_store_info(self):
        """Extract store information from the page."""
        stores = []
        try:
            store_elements = wait_for_elements(
                self.driver,
                "//div[contains(@class, 'StoreCard')]",
                timeout=10
            )
            
            for element in store_elements:
                try:
                    name = element.find_element(By.XPATH, ".//h3").text
                    address = element.find_element(By.XPATH, ".//p[contains(@class, 'address')]").text
                    stores.append({
                        "name": name,
                        "address": address
                    })
                except Exception as e:
                    logger.warning(f"Failed to extract store info: {str(e)}")
                    continue
            
            return stores
        except Exception as e:
            logger.error(f"Error extracting store information: {str(e)}")
            raise 