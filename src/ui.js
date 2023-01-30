import _ from 'lodash';
import Project from './project';

export default function Screen() {
    const project = Project();
    const { projectList } = project;
    const sidebar = document.querySelector('.project-list');
    const content = document.querySelector('.content');

    function renderProjectUI() {
        const sideBarBtn = document.querySelector('button.add-project');
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
            deleteBtn.textContent = 'X';
            div.append(button, deleteBtn);
            sidebar.appendChild(div);
        });
    }

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
            const infoBtn = document.createElement('button');
            const delBtn = document.createElement('button');
            contentList
                .appendChild(Object.assign(document.createElement('div')))
                .append(
                    Object.assign(document.createElement('div'), {
                        textContent: item.title,
                    }),
                    Object.assign(infoBtn, {
                        textContent: 'Details',
                        className: 'info-btn',
                    }),
                    Object.assign(delBtn, {
                        textContent: 'X',
                        className: 'delete-todo',
                    })
                );
            delBtn.addEventListener('click', delToDoEvent);
            delBtn.setAttribute('data-index', indexNum);
        });
        content.append(
            Object.assign(h1, {
                textContent: dataName,
            }),
            Object.assign(button, {
                textContent: '+',
            }),
            contentList,
            Object.assign(document.createElement('div'), {
                className: 'form',
                style: 'display:none',
            })
        );
        button.addEventListener('click', addTodoProj);
    }

    function delProjectEvent(event) {
        project.delProject(
            Number(event.target.getAttribute('data-project-index'))
        );
        renderProjectUI();
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

    function addProject() {
        const form = document.createElement('form');
        const input = document.createElement('input');
        const submitInput = document.createElement('input');
        sidebar
            .appendChild(Object.assign(document.createElement('div')))
            .appendChild(form)
            .append(
                Object.assign(input, {
                    type: 'text',
                    name: 'project',
                    placeholder: 'Project Name?',
                }),
                Object.assign(submitInput, {
                    type: 'submit',
                    value: 'Add Project',
                })
            );

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
        formDiv
            .appendChild(Object.assign(document.createElement('form')))
            .append(
                Object.assign(document.createElement('input'), {
                    type: 'text',
                    name: 'title',
                    placeholder: 'Title. Ex:Basuh baju',
                }),
                Object.assign(document.createElement('input'), {
                    type: 'text',
                    name: 'details',
                    placeholder: 'Details',
                }),
                Object.assign(document.createElement('input'), {
                    type: 'date',
                    name: 'date',
                }),
                Object.assign(document.createElement('input'), {
                    type: 'submit',
                    value: 'Submit',
                })
            );
        formDiv.style.display = '';

        const form = document.querySelector('form');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            project.addTodo(
                Number(projectElement.getAttribute('data-index')),
                event.target.title.value,
                event.target.details.value,
                event.target.date.value
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
