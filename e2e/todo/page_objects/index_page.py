from . import PageObject
from .todo_page import TodoListPage

class IndexPage(PageObject):

    def __init__(self, driver, target_origin):
        super(IndexPage, self).__init__(driver)
        self.target_origin = target_origin

    def open(self):
        self.driver.get(self.target_origin)
        return TodoListPage(self.driver)
