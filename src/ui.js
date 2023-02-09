/* eslint-disable import/no-extraneous-dependencies */
import _, { assign } from 'lodash';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import Project from './project';
import Storage from './localstorage';

// Project tab UI

export default function Screen() {
    const project = Project(); // Factory function from project.js
    const storage = Storage();
    const { projectList } = project; // Project + tasklist array
    const projectSidebarH1 = document.querySelector(
        '.sidebar > h1:nth-child(2)'
    );
    const sidebar = document.querySelector('.project-list'); // Div box for projects
    const content = document.querySelector('.content');

    // Sidebar project button manipulation

    projectSidebarH1.style.cursor = 'pointer';
    function collapseProjectList() {
        const projectBtn = document.querySelector('button.add-project');
        const projectListDiv = document.querySelector('.project-list');
        if (projectSidebarH1.className === 'collapse') {
            [
                projectBtn.style.display,
                projectListDiv.style.display,
                projectSidebarH1.className,
            ] = ['', '', 'uncollapse'];
        } else if (projectSidebarH1.className === 'uncollapse') {
            [
                projectBtn.style.display,
                projectListDiv.style.display,
                projectSidebarH1.className,
            ] = ['none', 'none', 'collapse'];
        }
    }
    projectSidebarH1.addEventListener('click', collapseProjectList);

    // Check local storage if there's stored project

    storage.checkLocalStorage(projectList, 'projects');

    // Render project from projectList arr to the display

    function renderProjectUI() {
        const sideBarBtn = document.querySelector('button.add-project'); // Add project button
        sideBarBtn.disabled = false;
        sideBarBtn.addEventListener('click', addProject);
        sidebar.textContent = '';
        content.textContent = '';
        if (projectList.length === 0) document.querySelector('.home').click();

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

    // Event handler for add project

    function addProject(e) {
        e.target.disabled = true;
        const div = document.createElement('div');
        const form = document.createElement('form');
        const cancelBtn = document.createElement('button');
        sidebar
            .appendChild(
                Object.assign(div, {
                    className: 'project-form',
                })
            )
            .appendChild(form)
            .append(
                Object.assign(document.createElement('input'), {
                    type: 'text',
                    name: 'project',
                    placeholder: 'Project Name?',
                    required: true,
                }),
                Object.assign(document.createElement('input'), {
                    type: 'submit',
                    value: 'Add Project',
                    style: 'border-color: var(--add-btn);',
                }),
                Object.assign(cancelBtn, {
                    textContent: 'Cancel',
                    style: 'border-color: var(--cancel-btn);',
                })
            );

        cancelBtn.addEventListener('click', () => {
            div.remove();
            e.target.disabled = false;
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            project.Addproject(event.target.project.value);
            storage.updateLocalStorage(projectList, 'projects');
            const newProjectIndex = projectList.findIndex(
                (element) => element === projectList[projectList.length - 1]
            );
            renderProjectUI();
            document
                .querySelector(`[data-project-index="${newProjectIndex}"]`)
                .click();
            setCollapsed();
        });
    }

    // Event handler for delete project

    function delProjectEvent(event) {
        project.delProject(
            Number(event.target.getAttribute('data-project-index'))
        );
        storage.updateLocalStorage(projectList, 'projects');
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
        setCollapsed();
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

    // Render form for add & edit task

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
        const submitValue = type === 'rename' ? 'Confirm' : 'Add Task';
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
                style: 'border-color: var(--add-btn);',
            }),
            Object.assign(cancelBtn, {
                textContent: 'Cancel',
                style: 'border-color: var(--cancel-btn);',
            })
        );
        return { form, cancelBtn };
    }

    // Event handler for add task into project

    function addTodoProj(e) {
        document
            .querySelectorAll('button.edit-task-btn')
            .forEach((btn) => (btn.disabled = true));
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
            storage.updateLocalStorage(projectList, 'projects');
            projectBtn.click();
        });
    }

    // Event handler for edit task of the project

    function editTask(event) {
        document
            .querySelectorAll('button.edit-task-btn')
            .forEach((btn) => (btn.disabled = true));
        const parentelement = event.target.parentElement;
        const projectIndex = Number(event.target.getAttribute('project-index'));
        const taskIndex = Number(event.target.getAttribute('data-index'));
        const currentProject = document.querySelector(
            `[data-project-index="${projectIndex}"]`
        );
        parentelement.className = 'form';
        parentelement.style.borderLeft = '';
        parentelement.parentElement.previousElementSibling.disabled = true; // Disabling add task button
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
            storage.updateLocalStorage(projectList, 'projects');
            currentProject.click();
        });
    }

    // Event handler for delete task of the project

    function delToDoEvent(event) {
        const projectIndex = document
            .querySelector('.content h1')
            .getAttribute('data-index');
        project.delTodo(
            Number(projectIndex),
            event.target.getAttribute('data-index')
        );
        storage.updateLocalStorage(projectList, 'projects');
        renderProjectUI();
        document
            .querySelector(`[data-project-index="${projectIndex}"]`)
            .click();
    }

    // Event handler for check task

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
        storage.updateLocalStorage(projectList, 'projects');
    }

    // Event handler for show details of task

    function showDetails(event) {
        const detailsElement = event.target.parentElement.lastElementChild;
        if (detailsElement.style.display === 'none') {
            detailsElement.style.display = 'block';
            event.target.style.backgroundColor = 'grey';
        } else {
            detailsElement.style.display = 'none';
            event.target.style.backgroundColor = '';
        }
    }

    // Collapsed Sidebar for compact width

    function setCollapsed() {
        document
            .querySelectorAll('div.sidebar button.project')
            .forEach((btn) =>
                btn.addEventListener(
                    'click',
                    () => (sidebar.parentElement.className = 'sidebar disable')
                )
            );
    }

    renderProjectUI();
    setCollapsed();

    return { project, renderProjectUI };
}
