import _ from 'lodash';
import Project from './project';

export default function Screen() {
    const project = Project();
    const { projectList } = project;

    function renderProjectUI() {
        projectList.forEach((item) => {
            const sidebar = document.querySelector('.project-list');
            const button = document.createElement('button');
            button.setAttribute('data-name', item.name);
            button.textContent = item.name;
            sidebar.append(button);
        });

        const projectBtn = document.querySelectorAll('.project-list button');
        function renderToDo(event) {
            const dataName = event.target.getAttribute('data-name');
            document.querySelector('.content h1').textContent = dataName;
            const index = projectList.findIndex(
                (list) => list.name === dataName
            );
            const contentList = document.querySelector('.content-list');
            contentList.textContent = '';
            projectList[index].tasklist.forEach((item) => {
                const div = document.createElement('div');
                div.textContent = item;
                contentList.appendChild(div);
            });
        }
        projectBtn.forEach((btn) => {
            btn.addEventListener('click', renderToDo);
        });
    }

    function addProject() {
        const newProject = prompt('name');
        project.Addproject(newProject);
        document.querySelector('.project-list').textContent = '';
        renderProjectUI();
        document.querySelector(`[data-name="${newProject}"]`).click();
        console.table(projectList);
    }

    function addTodoProj() {
        const projectName = document.querySelector('.content h1').textContent;
        const task = prompt('What task');
        document.querySelector('.project-list').textContent = '';
        project.addTodo(projectName, task);
        renderProjectUI();
        document.querySelector(`[data-name="${projectName}"]`).click();
        console.table(projectList);
    }

    const sideBarBtn = document.querySelector('.sidebar > button');
    const projectToDoBtn = document.querySelector('.content > button');
    projectToDoBtn.addEventListener('click', addTodoProj);
    sideBarBtn.addEventListener('click', addProject);

    project.Addproject('Groceries');
    renderProjectUI();
    document.querySelector(`[data-name="Groceries"]`).click();
}
