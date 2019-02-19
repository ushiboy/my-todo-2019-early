from selenium import webdriver
from datetime import datetime, timedelta
from selenium.webdriver.support.color import Color
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.alert import Alert
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import Select
import time

class PageObject(object):

    def __init__(self, driver):
        self.driver = driver

    def _wait_show(self, xpath, timeout=5):
        WebDriverWait(self.driver, timeout).until(
            EC.presence_of_element_located((By.XPATH, xpath))
        )

    def _focus_field(self, el):
        ActionChains(self.driver)\
                .move_to_element(el)\
                .click(el)\
                .perform()
        return self

    def _clear_field(self, el):
        ActionChains(self.driver)\
                .key_down(Keys.CONTROL)\
                .send_keys('a')\
                .key_up(Keys.CONTROL)\
                .send_keys(Keys.DELETE)\
                .perform()
        return self

    def _set_form_field_value(self, el, value):
        self._focus_field(el)\
                ._clear_field(el)
        el.send_keys(value)

    def _wait_loading_complete(self, el):
        def f():
            try:
                el.find_element_by_class_name('_loading_overlay_overlay')
                return False
            except:
                return True
        WebDriverWait(self.driver, 5).until(
            lambda d: f()
        )
        return self

    def wait_show_success_toast(self):
        WebDriverWait(self.driver, 5).until(
            EC.presence_of_element_located((By.CLASS_NAME, 'Toastify__toast--success'))
        )
        return self

    def get_confirm_dialog(self):
        return Alert(self.driver)

    def reload(self):
        self.driver.refresh()
        return self
