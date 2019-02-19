from . import PageObject
from .todo_page import TodoListPage

class IndexPage(PageObject):

    def __init__(self, driver, target_host):
        super(IndexPage, self).__init__(driver)
        self.target_host = target_host

    def open(self):
        self.driver.get("http://" + self.target_host + ":8080/")
        return TodoListPage(self.driver)
