import os

class Config:
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production'
    
    # Selenium settings
    CHROME_DRIVER_PATH = os.environ.get('CHROME_DRIVER_PATH')
    CHROME_BINARY_PATH = os.environ.get('CHROME_BINARY_PATH')
    
    # Browser settings
    BROWSER_WINDOW_SIZE = '1920,1080'
    USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    
    # Timeouts
    ELEMENT_TIMEOUT = 5
    PAGE_LOAD_TIMEOUT = 30
    
    # Retry settings
    MAX_RETRIES = 3
    RETRY_DELAY = 1 