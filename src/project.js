export default function Project() {
    const projectList = [];

    function Addproject(name) {
        projectList.push({ name, tasklist: [] });
        return { name, tasklist: [] };
    }

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

    const editToDo = (
        projectIndex,
        taskIndex,
        title,
        details,
        dueDate,
        priority
    ) => {
        const taskObj = projectList[projectIndex].tasklist[taskIndex];
        console.table(taskObj);
        taskObj.title = title;
        taskObj.details = details;
        taskObj.dueDate = dueDate;
        taskObj.priority = priority;
        console.table(taskObj);
    };

    const checkedTask = (projectIndex, taskIndex, isCheck) => {
        projectList[projectIndex].tasklist[taskIndex].checked = isCheck;
    };

    const delTodo = (index, taskIndex) => {
        projectList[index].tasklist.splice(taskIndex, 1);
    };

    return {
        projectList,
        Addproject,
        delProject,
        addTodo,
        editToDo,
        checkedTask,
        delTodo,
    };
}
