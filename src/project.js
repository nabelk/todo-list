export default function Project() {
    const projectList = [];

    function Addproject(name) {
        projectList.push({ name, tasklist: [] });
        return { name, tasklist: [] };
    }

    const addTodo = (name, task) => {
        const index = projectList.findIndex((list) => list.name === name);
        projectList[index].tasklist.push(task);
    };

    return { projectList, Addproject, addTodo };
}
