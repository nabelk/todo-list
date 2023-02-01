import _ from 'lodash';
import Screen from './ui';

const ui = Screen();

ui.project.Addproject('Groceries');
ui.project.addTodo(0, 'Beli Nasi', 'Nasi Goreng', '2023-01-06', 'high', false);
ui.project.addTodo(
    0,
    'Beli Buah',
    'Buah orange',
    '2023-01-06',
    'medium',
    false
);
ui.project.addTodo(0, 'Beli Buah', 'Buah orange', '2023-01-06', 'medium', true);
ui.renderProjectUI();
document.querySelector(`[data-project-index="0"]`).click();
