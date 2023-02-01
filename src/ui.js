/* eslint-disable import/no-extraneous-dependencies */
import _, { assign } from 'lodash';
import { format } from 'date-fns';
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
            let datedetail = item.dueDate;
            if (datedetail !== '') {
                datedetail = format(new Date(datedetail), 'd MMMM yyyy');
            }
            if (item.priority === 'low') {
                div.style.borderLeft = 'solid 2px green';
            } else if (item.priority === 'medium') {
                div.style.borderLeft = 'solid 2px yellow';
            } else if (item.priority === 'high') {
                div.style.borderLeft = 'solid 2px red';
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
                Object.assign(delBtn, {
                    textContent: '✖',
                    className: 'delete-todo',
                }),
                Object.assign(document.createElement('div'), {
                    textContent: `Details: ${item.details}\r\nPriority: ${item.priority}\r\nDue Date: ${datedetail}\r\n`,
                    style: 'display:none',
                })
            );
            if (item.checked) {
                task.className = 'checked';
            }
            task.addEventListener('click', checkedTask);
            task.setAttribute('project-index', dataIndex);
            task.setAttribute('data-index', indexNum);
            infoBtn.addEventListener('click', showDetails);
            delBtn.setAttribute('data-index', indexNum);
            delBtn.addEventListener('click', delToDoEvent);
        });
        content.append(
            Object.assign(h1, {
                textContent: dataName,
            }),
            Object.assign(button, {
                textContent: '➕',
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
        const projectElement = document.querySelector('.content h1');
        const formDiv = document.querySelector('div.form');
        const cancelButton = document.createElement('button');
        formDiv
            .appendChild(Object.assign(document.createElement('form')))
            .append(
                Object.assign(document.createElement('input'), {
                    type: 'text',
                    name: 'title',
                    placeholder: 'Title',
                }),
                Object.assign(document.createElement('input'), {
                    type: 'text',
                    name: 'details',
                    placeholder: 'Details',
                }),
                Object.assign(document.createElement('input'), {
                    type: 'text',
                    name: 'priority',
                    placeholder: 'Priority',
                }),
                Object.assign(document.createElement('input'), {
                    type: 'date',
                    name: 'date',
                    min: format(new Date(), 'yyyy-MM-dd'),
                }),
                Object.assign(document.createElement('input'), {
                    type: 'submit',
                    value: 'Add Task',
                }),
                Object.assign(cancelButton, {
                    textContent: 'Cancel',
                })
            );
        formDiv.style.display = '';

        cancelButton.addEventListener('click', () => {
            cancelButton.parentElement.remove();
            formDiv.style.display = 'none';
            e.target.disabled = false;
        });

        const form = document.querySelector('form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            project.addTodo(
                Number(projectElement.getAttribute('data-index')),
                event.target.title.value,
                event.target.details.value,
                event.target.date.value,
                event.target.priority.value,
                false
            );
            renderProjectUI();
            document
                .querySelector(
                    `[data-project-index="${projectElement.getAttribute(
                        'data-index'
                    )}"]`
                )
                .click();
            formDiv.style.display = 'none';
            form.remove();
            console.table('projects: ', projectElement.textContent);
            console.table(
                projectList[Number(projectElement.getAttribute('data-index'))]
                    .tasklist
            );
        });
    }
    return { project, renderProjectUI };
}
