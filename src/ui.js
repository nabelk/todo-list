import _ from 'lodash';
import Project from './project';

export default function Screen() {
    const project = Project();
    const { projectList } = project;

    function renderProjectUI() {
        const sidebar = document.querySelector('.project-list');
        const content = document.querySelector('.content');
        sidebar.textContent = '';
        content.textContent = '';

        projectList.forEach((item, index) => {
            const div = document.createElement('div');
            const button = document.createElement('button');
            const deleteBtn = document.createElement('button');
            button.setAttribute('data-index', index);
            button.setAttribute('data-name', item.name);
            deleteBtn.setAttribute('data-index', index);
            deleteBtn.addEventListener('click', delProjectEvent);
            button.className = 'project';
            deleteBtn.className = 'delete-project';
            button.textContent = item.name;
            deleteBtn.textContent = 'X';
            div.append(button, deleteBtn);
            sidebar.appendChild(div);
        });

        const projectBtn = document.querySelectorAll('button.project');
        function renderToDo(event) {
            const dataName = event.target.getAttribute('data-name');
            const h1 = document.createElement('h1');
            const button = document.createElement('button');
            const contentList = document.createElement('div');
            content.textContent = '';
            h1.textContent = dataName;
            button.textContent = '+';
            h1.setAttribute(
                'data-index',
                event.target.getAttribute('data-index')
            );
            contentList.className = 'content-list';
            const index = projectList.findIndex(
                (list) => list.name === dataName
            );
            projectList[index].tasklist.forEach((item, indexNum) => {
                const div = document.createElement('div');
                const div2 = document.createElement('div');
                const delBtn = document.createElement('button');
                div2.textContent = item;
                delBtn.textContent = 'X';
                delBtn.className = 'delete-todo';
                delBtn.addEventListener('click', delToDoEvent);
                delBtn.setAttribute('data-index', indexNum);
                div.append(div2, delBtn);
                contentList.appendChild(div);
            });
            content.append(h1, button, contentList);
            button.addEventListener('click', addTodoProj);
        }
        projectBtn.forEach((btn) => {
            btn.addEventListener('click', renderToDo);
        });
    }

    project.Addproject('Groceries');
    project.addTodo('Groceries', 'Beli Buah');
    renderProjectUI();
    document.querySelector(`[data-name="Groceries"]`).click();

    function delProjectEvent(event) {
        project.delProject(Number(event.target.getAttribute('data-index')));
        renderProjectUI();
        console.table(projectList);
    }

    function delToDoEvent(event) {
        const projectIndex = document.querySelector('.content h1');
        project.delTodo(
            Number(projectIndex.getAttribute('data-index')),
            event.target.getAttribute('data-index')
        );
        renderProjectUI();
        document
            .querySelector(`[data-name="${projectIndex.textContent}"]`)
            .click();
        console.table(projectList);
    }

    const sideBarBtn = document.querySelector('button.add-project');
    function addProject() {
        const newProject = prompt('name');
        project.Addproject(newProject);
        renderProjectUI();
        document.querySelector(`[data-name="${newProject}"]`).click();
        console.table(projectList);
    }
    sideBarBtn.addEventListener('click', addProject);

    function addTodoProj() {
        const projectName = document.querySelector('.content h1').textContent;
        const task = prompt('What task');
        project.addTodo(projectName, task);
        renderProjectUI();
        document.querySelector(`[data-name="${projectName}"]`).click();
        console.table(projectList);
    }
}
