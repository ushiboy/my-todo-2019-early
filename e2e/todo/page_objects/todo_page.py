from . import PageObject

class TodoListPage(PageObject):

    @property
    def el(self):
        return self.driver.find_element_by_css_selector('div[data-test="todo-list"]')

    def wait_show_todo_list(self):
        self._wait_show('div[data-test="todo-list"]')
        return self

    def wait_loading_complete(self):
        return self._wait_loading_complete(self.el)

    def get_todo_rows(self):
        rows = self.el.find_elements_by_css_selector('tr[data-test="todo-list-row"]')
        return list(map(lambda el: TodoListRow(self.driver, el), rows))

    def click_create_todo_button(self):
        b = self.el.find_element_by_css_selector('a[data-test="create-todo-button"]')
        b.click()
        return TodoFormPage(self.driver)

    def click_all_tab(self):
        t = self.el.find_element_by_css_selector('a[data-test="all-tab"]')
        t.click()
        return self

    def click_active_tab(self):
        t = self.el.find_element_by_css_selector('a[data-test="active-tab"]')
        t.click()
        return self

    def click_completed_tab(self):
        t = self.el.find_element_by_css_selector('a[data-test="completed-tab"]')
        t.click()
        return self

class TodoListRow(PageObject):

    def __init__(self, driver, el):
        super(TodoListRow, self).__init__(driver)
        self.el = el

    def get_title(self):
        c = self.el.find_element_by_css_selector('td[data-test="title-column"]')
        return c.text.strip()

    def click_edit_todo_button(self):
        b = self.el.find_element_by_css_selector('a[data-test="edit-todo-button"]')
        b.click()
        return TodoFormPage(self.driver)

class TodoFormPage(PageObject):

    @property
    def el(self):
        return self.driver.find_element_by_css_selector('div[data-test="todo-form"]')

    def wait_show_todo_form(self):
        self._wait_show('div[data-test="todo-form"]')
        return self

    def wait_loading_complete(self):
        return self._wait_loading_complete(self.el)

    def get_title(self):
        f = self.el.find_element_by_css_selector('input[data-test="title-field"]')
        return f.get_attribute('value')

    def set_title(self, v):
        f = self.el.find_element_by_css_selector('input[data-test="title-field"]')
        self._set_form_field_value(f, v)
        return self

    def is_complete(self):
        f = self.el.find_element_by_css_selector('input[data-test="complete-field"]')
        return f.is_selected()

    def set_complete(self):
        f = self.el.find_element_by_css_selector('input[data-test="complete-field"]')
        if not f.is_selected():
            f.click()
        return self

    def click_save_button(self):
        b = self.el.find_element_by_css_selector('button[data-test="save-button"]')
        b.click()
        return TodoListPage(self.driver)

    def click_remove_button(self):
        b = self.el.find_element_by_css_selector('button[data-test="remove-button"]')
        b.click()
        return self

    def click_yes_on_remove_confirm_dialog(self):
        c = self.get_confirm_dialog()
        c.accept()
        return TodoListPage(self.driver)
