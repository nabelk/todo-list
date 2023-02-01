export default function Project() {
    const projectList = [];

    function Addproject(name) {
        projectList.push({ name, tasklist: [] });
        return { name, tasklist: [] };
    }

    const getIndexProject = (name) =>
        projectList.findIndex((list) => list.name === name);

    const delProject = (index) => {
        projectList.splice(index, 1);
    };

    const addTodo = (
        projectIndex,
        title,
        details,
        dueDate,
        priority,
        checked
    ) => {
        projectList[projectIndex].tasklist.push({
            title,
            details,
            dueDate,
            priority,
            checked,
        });
    };

    const checkedTask = (projectIndex, taskIndex, boolean) => {
        projectList[projectIndex].tasklist[taskIndex].checked = boolean;
    };

    const delTodo = (index, taskIndex) => {
        projectList[index].tasklist.splice(taskIndex, 1);
    };

    return {
        projectList,
        Addproject,
        delProject,
        addTodo,
        checkedTask,
        delTodo,
    };
}
