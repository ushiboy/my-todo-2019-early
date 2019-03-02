import os
import unittest
from selenium import webdriver
from ..environment import load_e2e_config

DRIVERS_DIR_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'drivers')
E2E_CONFIG_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'e2e.config.yml')

class E2ETest(unittest.TestCase):

    def setUp(self):
        target_host = os.environ.get('SERVER_HOST', 'localhost')
        target_port = '8080'
        worker = os.environ.get('PYTEST_XDIST_WORKER')
        if worker is not None:
            config = load_e2e_config(E2E_CONFIG_PATH)
            c = config[worker]
            target_port = str(c['web_port'])

        self.target_origin = 'http://%s:%s/' % (target_host, target_port)
        use_headless = os.environ.get('HEADLESS', False)
        browser = os.environ.get('BROWSER', 'Chrome')

        if browser == 'Chrome':
            driver_path = os.path.join(DRIVERS_DIR_PATH, 'chromedriver')
            options = webdriver.chrome.options.Options()
            if use_headless:
                options.add_argument('--headless')
            self.driver = webdriver.Chrome(executable_path=driver_path, options=options)
        elif browser == 'Firefox':
            driver_path = os.path.join(DRIVERS_DIR_PATH, 'geckodriver')
            options = webdriver.firefox.options.Options()
            if use_headless:
                options.add_argument('-headless')
            self.driver = webdriver.Firefox(executable_path=driver_path, options=options)

    def tearDown(self):
        self.driver.close()
        self.driver.quit()
