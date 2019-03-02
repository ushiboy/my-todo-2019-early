import unittest
from . import E2ETest
from ..page_objects.index_page import IndexPage
from ..datas.initializer import LocalStorage

init_todo_datas = [
    ('item-keys', '1,2,3'),
    ('1', '{"id":1,"title":"t1","complete":true,"updatedAt":"2019-01-01T00:00:00.000Z"}'),
    ('2', '{"id":2,"title":"t2","complete":false,"updatedAt":"2019-01-01T00:00:00.000Z"}'),
    ('3', '{"id":3,"title":"t3","complete":false,"updatedAt":"2019-01-01T00:00:00.000Z"}')
]

def init_data(driver):
    s = LocalStorage(driver)
    for k, v in init_todo_datas:
        s.set_local_storage_item(k, v)


class TodosTest(E2ETest):

    def test_show_todo_list_rows(self):
        p = IndexPage(self.driver, self.target_origin)\
                .open()

        init_data(self.driver)

        p = p.reload()\
                .wait_show_todo_list()

        rows = p.get_todo_rows()
        assert len(rows) == 3
        r1, r2, r3 = rows;
        assert r1.get_title() == 't1'
        assert r2.get_title() == 't2'
        assert r3.get_title() == 't3'

    def test_filter_todo_list_rows(self):
        p = IndexPage(self.driver, self.target_origin)\
                .open()

        init_data(self.driver)

        p = p.reload()\
                .wait_show_todo_list()\
                .wait_loading_complete()

        rows = p.get_todo_rows()
        assert len(rows) == 3
        r1, r2, r3 = rows;
        assert r1.get_title() == 't1'
        assert r2.get_title() == 't2'
        assert r3.get_title() == 't3'

        p.click_active_tab()
        rows = p.get_todo_rows()
        assert len(rows) == 2
        r1, r2 = rows;
        assert r1.get_title() == 't2'
        assert r2.get_title() == 't3'

        p.click_completed_tab()
        rows = p.get_todo_rows()
        assert len(rows) == 1
        assert rows[0].get_title() == 't1'

        p.click_all_tab()
        rows = p.get_todo_rows()
        assert len(rows) == 3
        r1, r2, r3 = rows;
        assert r1.get_title() == 't1'
        assert r2.get_title() == 't2'
        assert r3.get_title() == 't3'

    def test_create_new_todo(self):
        p = IndexPage(self.driver, self.target_origin)\
                .open()\
                .wait_show_todo_list()
        assert len(p.get_todo_rows()) == 0

        f = p.click_create_todo_button()\
                .wait_show_todo_form()
        assert f.get_title() == ''

        p = f.set_title('test')\
                .click_save_button()\
                .wait_show_success_toast()

        rows = p.get_todo_rows()
        assert len(rows) == 1
        assert rows[0].get_title() == 'test'

    def test_edit_todo(self):
        p = IndexPage(self.driver, self.target_origin)\
                .open()

        init_data(self.driver)

        p = p.reload()\
                .wait_show_todo_list()\
                .wait_loading_complete()

        rows = p.get_todo_rows()
        assert len(rows) == 3
        r1, r2, r3 = rows;
        assert r1.get_title() == 't1'
        assert r2.get_title() == 't2'
        assert r3.get_title() == 't3'

        f = r2.click_edit_todo_button()\
                .wait_show_todo_form()\
                .wait_loading_complete()

        assert f.get_title() == 't2'
        assert not f.is_complete()

        p = f.set_title('modified')\
                .set_complete()\
                .click_save_button()\
                .wait_show_success_toast()

        rows = p.get_todo_rows()
        assert len(rows) == 3
        r1, r2, r3 = rows;
        assert r1.get_title() == 't1'
        assert r2.get_title() == 'modified'
        assert r3.get_title() == 't3'

        p.click_completed_tab()
        rows = p.get_todo_rows()
        assert len(rows) == 2
        r1, r2 = rows;
        assert r1.get_title() == 't1'
        assert r2.get_title() == 'modified'

    def test_remove_todo(self):
        p = IndexPage(self.driver, self.target_origin)\
                .open()

        init_data(self.driver)

        p = p.reload()\
                .wait_show_todo_list()\
                .wait_loading_complete()

        rows = p.get_todo_rows()
        assert len(rows) == 3
        r1, r2, r3 = rows;
        assert r1.get_title() == 't1'
        assert r2.get_title() == 't2'
        assert r3.get_title() == 't3'

        f = r2.click_edit_todo_button()\
                .wait_show_todo_form()\
                .wait_loading_complete()

        p = f.click_remove_button()\
                .click_yes_on_remove_confirm_dialog()\
                .wait_show_success_toast()

        rows = p.get_todo_rows()
        assert len(rows) == 2
        r1, r2  = rows;
        assert r1.get_title() == 't1'
        assert r2.get_title() == 't3'

if __name__ == '__main__':
    unittest.main()
