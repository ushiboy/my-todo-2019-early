import os
import unittest
from selenium import webdriver

DRIVERS_DIR_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'drivers')

class E2ETest(unittest.TestCase):

    def setUp(self):
        self.target_host = os.environ.get('SERVER_HOST', 'localhost')
        use_headless = os.environ.get('HEADLESS', False)

        driver_path = os.path.join(DRIVERS_DIR_PATH, 'chromedriver')
        options = webdriver.chrome.options.Options()
        if use_headless:
            options.add_argument('--headless')
        self.driver = webdriver.Chrome(executable_path=driver_path, options=options)

    def tearDown(self):
        self.driver.close()
        self.driver.quit()
