class LocalStorage(object):

    def __init__(self, driver):
        self.driver = driver

    def set_local_storage_item(self, key, value):
        s = "window.localStorage.setItem('{key}', '{value}');".format(key=key, value=value)
        self.driver.execute_script(s)

    def clear_local_storage(self, key, value):
        self.driver.execute_script('window.localStorage.clear();')

