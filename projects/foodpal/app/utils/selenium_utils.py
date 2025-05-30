from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import StaleElementReferenceException
import time
import logging
from flask import current_app

logger = logging.getLogger(__name__)

def safe_click(driver, xpath, retries=3):
    """Safely click an element with retry logic."""
    for attempt in range(retries):
        try:
            element = WebDriverWait(driver, current_app.config['ELEMENT_TIMEOUT']).until(
                EC.element_to_be_clickable((By.XPATH, xpath))
            )
            time.sleep(current_app.config['RETRY_DELAY'])
            element.click()
            return True
        except Exception as e:
            logger.warning(f"Click attempt {attempt + 1} failed: {str(e)}")
            if attempt == retries - 1:
                raise
    return False

def try_multiple_clicks(driver, xpaths, retries=3):
    """Try clicking multiple possible elements until one succeeds."""
    for xpath in xpaths:
        try:
            if safe_click(driver, xpath, retries):
                return True
        except Exception as e:
            logger.warning(f"Failed to click using xpath {xpath}: {str(e)}")
            continue
    return False

def safe_send_keys(driver, xpath, text, retries=3):
    """Safely send keys to an element with retry logic."""
    for attempt in range(retries):
        try:
            element = WebDriverWait(driver, current_app.config['ELEMENT_TIMEOUT']).until(
                EC.presence_of_element_located((By.XPATH, xpath))
            )
            element.clear()
            element.send_keys(text)
            time.sleep(current_app.config['RETRY_DELAY'])
            return True
        except Exception as e:
            logger.warning(f"Send keys attempt {attempt + 1} failed: {str(e)}")
            if attempt == retries - 1:
                raise
    return False

def safe_send_keys2(driver, xpaths, text, retries=3):
    """Try sending keys to multiple possible elements until one succeeds."""
    for xpath in xpaths:
        try:
            if safe_send_keys(driver, xpath, text, retries):
                return True
        except Exception as e:
            logger.warning(f"Failed to send keys using xpath {xpath}: {str(e)}")
            continue
    return False

def wait_for_element(driver, xpath, timeout=None):
    """Wait for an element to be present and return it."""
    if timeout is None:
        timeout = current_app.config['ELEMENT_TIMEOUT']
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_element_located((By.XPATH, xpath))
    )

def wait_for_elements(driver, xpath, timeout=None):
    """Wait for elements to be present and return them."""
    if timeout is None:
        timeout = current_app.config['ELEMENT_TIMEOUT']
    return WebDriverWait(driver, timeout).until(
        EC.presence_of_all_elements_located((By.XPATH, xpath))
    ) 