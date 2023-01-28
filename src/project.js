export default function Project() {
    const projectList = [];

    function Addproject(name) {
        projectList.push({ name, tasklist: [] });
        return { name, tasklist: [] };
    }

    const delProject = (index) => {
        projectList.splice(index, 1);
    };

    const addTodo = (name, task) => {
        const index = projectList.findIndex((list) => list.name === name);
        projectList[index].tasklist.push(task);
    };

    const delTodo = (index, taskIndex) => {
        projectList[index].tasklist.splice(taskIndex, 1);
    };

    return { projectList, Addproject, delProject, addTodo, delTodo };
}
