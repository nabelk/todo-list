/* eslint-disable import/no-extraneous-dependencies */
import { format } from 'date-fns';
import Home from './home';

export default function HomeTab() {
    const home = Home();
    const { homeTask } = home;
    const content = document.querySelector('.content');
    const homeSideBarBtn = document.querySelector('.home');
    homeSideBarBtn.style.cursor = 'pointer';
    homeSideBarBtn.addEventListener('click', renderHomeContent);

    function renderHomeContent(event) {
        content.textContent = '';
        const addTaskBtn = document.createElement('button');
        const contentList = document.createElement('div');
        homeTask.forEach((item, index) => {
            const div = document.createElement('div');
            const task = document.createElement('div');
            const infoBtn = document.createElement('button');
            const delBtn = document.createElement('button');
            const editBtn = document.createElement('button');
            let datedetail = item.dueDate;
            if (datedetail !== '') {
                datedetail = format(new Date(datedetail), 'd MMMM yyyy');
            }
            if (item.priority === 'Low') {
                div.style.borderLeft = 'solid 3px green';
            } else if (item.priority === 'Medium') {
                div.style.borderLeft = 'solid 3px yellow';
            } else if (item.priority === 'High') {
                div.style.borderLeft = 'solid 3px red';
            }
            contentList.appendChild(Object.assign(div)).append(
                Object.assign(task, {
                    textContent: item.title,
                    style: 'cursor:pointer',
                    className: 'not-check',
                }),
                Object.assign(infoBtn, {
                    textContent: 'Details',
                    className: 'info-btn',
                }),
                Object.assign(editBtn, {
                    textContent: 'Edit',
                    className: 'edit-task-btn',
                }),
                Object.assign(delBtn, {
                    textContent: '✖',
                    className: 'delete-todo',
                }),
                Object.assign(document.createElement('div'), {
                    textContent: `Project: Home\r\nDetails: ${item.details}\r\nPriority: ${item.priority}\r\nDue Date: ${datedetail}\r\n`,
                    style: 'display:none',
                })
            );
            if (item.checked) {
                task.className = 'checked';
            }
            task.setAttribute('data-index', index);
            task.addEventListener('click', checkedTask);
            infoBtn.addEventListener('click', showDetails);
            editBtn.setAttribute('data-index', index);
            editBtn.addEventListener('click', editTask);
            delBtn.setAttribute('data-index', index);
            delBtn.addEventListener('click', delTask);
        });
        content.append(
            Object.assign(document.createElement('h1'), {
                textContent: event.target.textContent,
            }),
            Object.assign(addTaskBtn, {
                textContent: '➕ Task',
                className: 'add-task-home',
            }),
            Object.assign(contentList, {
                className: 'content-list',
            })
        );
        addTaskBtn.addEventListener('click', addTask);
    }

    function renderForm(type, taskIndex) {
        const titleValue = type === 'rename' ? homeTask[taskIndex].title : '';
        const detailsValue =
            type === 'rename' ? homeTask[taskIndex].details : '';
        const dateValue = type === 'rename' ? homeTask[taskIndex].dueDate : '';
        const submitValue = type === 'rename' ? 'Confirm Changes' : 'Add Task';
        const form = document.createElement('form');
        const cancelBtn = document.createElement('button');
        const radioDiv = Object.assign(document.createElement('div'), {
            className: 'input-radio',
            style: 'display:flex; gap: 10px',
            textContent: 'Priority:',
        });
        radioDiv.append(
            Object.assign(document.createElement('input'), {
                type: 'radio',
                name: 'priority',
                id: 'low',
                value: 'Low',
                style: 'accent-color: green',
            }),
            Object.assign(document.createElement('label'), {
                for: 'low',
                textContent: 'Low',
            }),
            Object.assign(document.createElement('input'), {
                type: 'radio',
                name: 'priority',
                id: 'medium',
                value: 'Medium',
                style: 'accent-color: yellow;',
            }),
            Object.assign(document.createElement('label'), {
                for: 'medium',
                textContent: 'Medium',
            }),
            Object.assign(document.createElement('input'), {
                type: 'radio',
                name: 'priority',
                id: 'high',
                value: 'High',
                style: 'accent-color: red',
            }),
            Object.assign(document.createElement('label'), {
                for: 'high',
                textContent: 'High',
            })
        );

        form.append(
            Object.assign(document.createElement('input'), {
                type: 'text',
                name: 'title',
                placeholder: 'Title',
                value: titleValue,
            }),
            Object.assign(document.createElement('input'), {
                type: 'text',
                name: 'details',
                placeholder: 'Details',
                value: detailsValue,
            }),
            Object.assign(document.createElement('input'), {
                type: 'date',
                name: 'date',
                min: format(new Date(), 'yyyy-MM-dd'),
                value: dateValue,
            }),
            radioDiv,
            Object.assign(document.createElement('input'), {
                type: 'submit',
                value: submitValue,
            }),
            Object.assign(cancelBtn, {
                textContent: 'Cancel',
            })
        );

        cancelBtn.addEventListener('click', () => {
            homeSideBarBtn.click();
        });

        return { form };
    }

    function addTask(event) {
        event.target.disabled = true;
        const render = renderForm('Add Task');
        const { form } = render;
        content
            .appendChild(
                Object.assign(document.createElement('div'), {
                    className: 'form',
                })
            )
            .appendChild(form);

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            home.AddTask(
                e.target.title.value,
                e.target.details.value,
                e.target.date.value,
                e.target.priority.value,
                false
            );
            homeSideBarBtn.click();
        });
    }

    function editTask(event) {
        const parentelement = event.target.parentElement;
        const taskIndex = Number(event.target.getAttribute('data-index'));
        const { form } = renderForm('rename', taskIndex);
        parentelement.style.borderLeft = '';
        for (let i = 0; i <= 4; i++) {
            parentelement.children[i].style.display = 'none';
        }
        parentelement.appendChild(form);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            home.editTask(
                taskIndex,
                e.target.title.value,
                e.target.details.value,
                e.target.date.value,
                e.target.priority.value
            );
            homeSideBarBtn.click();
        });
    }

    function delTask(event) {
        home.delTask(Number(event.target.getAttribute('data-index')));
        homeSideBarBtn.click();
    }

    function checkedTask(event) {
        if (event.target.className === 'not-check') {
            event.target.className = 'checked';
            home.checkedTask(
                Number(event.target.getAttribute('data-index')),
                true
            );
        } else if (event.target.className === 'checked') {
            event.target.className = 'not-check';
            home.checkedTask(
                Number(event.target.getAttribute('data-index')),
                false
            );
        }
    }

    function showDetails(event) {
        const detailsElement = event.target.parentElement.lastElementChild;
        if (detailsElement.style.display === 'none') {
            detailsElement.style.display = 'block';
            event.target.style.color = 'green';
        } else {
            detailsElement.style.display = 'none';
            event.target.style.color = '';
        }
    }

    homeSideBarBtn.click();
}
