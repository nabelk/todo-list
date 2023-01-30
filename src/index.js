import _ from 'lodash';
import Screen from './ui';

const ui = Screen();

ui.project.Addproject('Groceries');
ui.project.addTodo(0, 'Beli Nasi');
ui.project.addTodo(0, 'Beli Buah');
ui.renderProjectUI();
document.querySelector(`[data-project-index="0"]`).click();
