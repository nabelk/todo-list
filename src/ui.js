/* eslint-disable import/no-extraneous-dependencies */
import _, { assign } from 'lodash';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import Project from './project';

export default function Screen() {
    const project = Project(); // Factory function from project.js
    const { projectList } = project; // Project + tasklist array
    const sidebar = document.querySelector('.project-list');
    const content = document.querySelector('.content');

    // Render project from projectList arr to the display

    function renderProjectUI() {
        const sideBarBtn = document.querySelector('button.add-project');
        sideBarBtn.disabled = false;
        sideBarBtn.addEventListener('click', addProject);
        sidebar.textContent = '';
        content.textContent = '';

        projectList.forEach((item, index) => {
            const div = document.createElement('div');
            const button = document.createElement('button');
            const deleteBtn = document.createElement('button');
            button.setAttribute('data-project-index', index);
            button.setAttribute('data-project-name', item.name);
            button.addEventListener('click', renderToDo);
            deleteBtn.setAttribute('data-project-index', index);
            deleteBtn.addEventListener('click', delProjectEvent);
            button.className = 'project';
            deleteBtn.className = 'delete-project';
            button.textContent = item.name;
            deleteBtn.textContent = '✖';
            div.append(button, deleteBtn);
            sidebar.appendChild(div);
        });
    }

    // Event handler to render task list of the project when clicking "button" variable from renderProjctUI

    function renderToDo(event) {
        content.textContent = '';
        const dataName = event.target.getAttribute('data-project-name');
        const dataIndex = event.target.getAttribute('data-project-index');
        const h1 = document.createElement('h1');
        const button = document.createElement('button');
        const contentList = document.createElement('div');
        h1.setAttribute('data-index', dataIndex);
        contentList.className = 'content-list';
        projectList[Number(dataIndex)].tasklist.forEach((item, indexNum) => {
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
                    textContent: `Project: ${dataName}\r\nDetails: ${item.details}\r\nPriority: ${item.priority}\r\nDue Date: ${datedetail}\r\n`,
                    style: 'display:none',
                })
            );
            if (item.checked) {
                task.className = 'checked';
            }
            task.addEventListener('click', checkedTask);
            task.setAttribute('project-index', dataIndex);
            task.setAttribute('data-index', indexNum);
            editBtn.setAttribute('project-index', dataIndex);
            editBtn.setAttribute('data-index', indexNum);
            editBtn.addEventListener('click', editTask);
            infoBtn.addEventListener('click', showDetails);
            delBtn.setAttribute('data-index', indexNum);
            delBtn.addEventListener('click', delToDoEvent);
        });
        content.append(
            Object.assign(h1, {
                textContent: dataName,
            }),
            Object.assign(button, {
                textContent: '➕ Task',
                className: 'add-task-btn',
            }),
            contentList,
            Object.assign(document.createElement('div'), {
                className: 'form',
                style: 'display:none',
            })
        );
        button.addEventListener('click', addTodoProj);
    }

    function checkedTask(event) {
        if (event.target.className === 'not-check') {
            event.target.className = 'checked';
            project.checkedTask(
                Number(event.target.getAttribute('project-index')),
                Number(event.target.getAttribute('data-index')),
                true
            );
        } else if (event.target.className === 'checked') {
            event.target.className = 'not-check';
            project.checkedTask(
                Number(event.target.getAttribute('project-index')),
                Number(event.target.getAttribute('data-index')),
                false
            );
        }
        console.table(
            projectList[Number(event.target.getAttribute('project-index'))]
                .tasklist
        );
    }

    function showDetails(event) {
        const detailsElement = event.target.parentElement.lastElementChild;
        if (detailsElement.style.display === 'none') {
            detailsElement.style.display = 'block';
            event.target.style.backgroundColor = 'green';
        } else {
            detailsElement.style.display = 'none';
            event.target.style.backgroundColor = '';
        }
    }

    function delProjectEvent(event) {
        project.delProject(
            Number(event.target.getAttribute('data-project-index'))
        );
        renderProjectUI();
        if (projectList.length !== 0) {
            document
                .querySelector(
                    `[data-project-index="${projectList.findIndex(
                        (element) =>
                            element === projectList[projectList.length - 1]
                    )}"]`
                )
                .click();
        }

        console.table(projectList);
    }

    function delToDoEvent(event) {
        const projectIndex = document
            .querySelector('.content h1')
            .getAttribute('data-index');
        project.delTodo(
            Number(projectIndex),
            event.target.getAttribute('data-index')
        );
        renderProjectUI();
        document
            .querySelector(`[data-project-index="${projectIndex}"]`)
            .click();
        console.table(projectList[projectIndex].tasklist);
    }

    function addProject(e) {
        e.target.disabled = true;
        const div = document.createElement('div');
        const form = document.createElement('form');
        const cancelBtn = document.createElement('button');
        sidebar
            .appendChild(Object.assign(div))
            .appendChild(form)
            .append(
                Object.assign(document.createElement('input'), {
                    type: 'text',
                    name: 'project',
                    placeholder: 'Project Name?',
                }),
                Object.assign(document.createElement('input'), {
                    type: 'submit',
                    value: 'Add Project',
                }),
                Object.assign(cancelBtn, {
                    textContent: 'Cancel',
                })
            );

        cancelBtn.addEventListener('click', () => {
            div.remove();
            e.target.disabled = false;
            console.log(div.textContent);
            console.table(projectList);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            project.Addproject(event.target.project.value);
            const newProjectIndex = projectList.findIndex(
                (element) => element === projectList[projectList.length - 1]
            );
            renderProjectUI();
            console.table(projectList);
            document
                .querySelector(`[data-project-index="${newProjectIndex}"]`)
                .click();
        });
    }

    function addTodoProj(e) {
        e.target.disabled = true;
        const projectIndex = document
            .querySelector('.content h1')
            .getAttribute('data-index');
        const projectBtn = document.querySelector(
            `[data-project-index="${projectIndex}"]`
        );
        const formDiv = document.querySelector('div.form');
        const { form, cancelBtn } = renderForm('Add task');
        formDiv.appendChild(form);
        formDiv.style.display = '';
        cancelBtn.addEventListener('click', () => {
            projectBtn.click();
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            project.addTodo(
                Number(projectIndex),
                event.target.title.value,
                event.target.details.value,
                event.target.date.value,
                event.target.priority.value,
                false
            );
            projectBtn.click();
            console.table('projects: ', projectList[projectIndex].name);
            console.table(projectList[projectIndex].tasklist);
        });
    }

    function renderForm(type, projectIndex, taskIndex) {
        const titleValue =
            type === 'rename'
                ? projectList[projectIndex].tasklist[taskIndex].title
                : '';
        const detailsValue =
            type === 'rename'
                ? projectList[projectIndex].tasklist[taskIndex].details
                : '';
        const dateValue =
            type === 'rename'
                ? projectList[projectIndex].tasklist[taskIndex].dueDate
                : '';
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
        console.log(type);
        return { form, cancelBtn };
    }

    function editTask(event) {
        const parentelement = event.target.parentElement;
        const projectIndex = Number(event.target.getAttribute('project-index'));
        const taskIndex = Number(event.target.getAttribute('data-index'));
        const currentProject = document.querySelector(
            `[data-project-index="${projectIndex}"]`
        );
        parentelement.style.borderLeft = '';
        for (let i = 0; i <= 4; i++) {
            parentelement.children[i].style.display = 'none';
        }
        const { form, cancelBtn } = renderForm(
            'rename',
            projectIndex,
            taskIndex
        );
        parentelement.appendChild(form);
        cancelBtn.addEventListener('click', () => {
            currentProject.click();
        });
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            project.editToDo(
                projectIndex,
                taskIndex,
                e.target.title.value,
                e.target.details.value,
                e.target.date.value,
                e.target.priority.value
            );
            currentProject.click();
        });
    }
    return { project, renderProjectUI };
}
