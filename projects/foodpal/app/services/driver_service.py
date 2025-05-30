import undetected_chromedriver as uc
from flask import current_app
import logging

logger = logging.getLogger(__name__)

class DriverService:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DriverService, cls).__new__(cls)
            cls._instance.driver = None
        return cls._instance
    
    def start_driver(self):
        """Initialize and start the Chrome WebDriver with appropriate options."""
        if not self.driver:
            try:
                options = uc.ChromeOptions()
                options.add_argument("--incognito")
                options.add_argument("--disable-blink-features=AutomationControlled")
                options.add_argument("--no-sandbox")
                options.add_argument("--disable-gpu")
                options.add_argument("--disable-dev-shm-usage")
                options.add_argument("--disable-extensions")
                options.add_argument(f"--window-size={current_app.config['BROWSER_WINDOW_SIZE']}")
                options.add_argument(f"user-agent={current_app.config['USER_AGENT']}")
                
                # Add Chrome binary path if specified
                if current_app.config['CHROME_BINARY_PATH']:
                    options.binary_location = current_app.config['CHROME_BINARY_PATH']
                
                self.driver = uc.Chrome(options=options)
                logger.info("Chrome WebDriver initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Chrome WebDriver: {str(e)}")
                raise
    
    def quit_driver(self):
        """Safely quit the Chrome WebDriver."""
        if self.driver:
            try:
                self.driver.quit()
                self.driver = None
                logger.info("Chrome WebDriver closed successfully")
            except Exception as e:
                logger.error(f"Error closing Chrome WebDriver: {str(e)}")
                raise
    
    def get_driver(self):
        """Get the current WebDriver instance, starting it if necessary."""
        if not self.driver:
            self.start_driver()
        return self.driver 