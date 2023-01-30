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
        // const index = getIndexProject(projectName);
        projectList[projectIndex].tasklist.push({
            title,
            details,
            dueDate,
            priority,
            checked,
        });
    };

    const getToDoDetails = (project, taskIndex) => {
        const index = getIndexProject(project);
        console.log(projectList[index].tasklist[taskIndex]);
    };

    const delTodo = (index, taskIndex) => {
        projectList[index].tasklist.splice(taskIndex, 1);
    };

    return {
        projectList,
        Addproject,
        delProject,
        addTodo,
        getToDoDetails,
        delTodo,
    };
}
