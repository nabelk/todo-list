export default function Home() {
    const homeTask = [];

    // Add new task

    function AddTask(title, details, dueDate, priority, checked) {
        homeTask.push({ title, details, dueDate, priority, checked });
    }

    // Delete task

    const delTask = (index) => {
        homeTask.splice(index, 1);
    };

    // Edit task

    const editTask = (index, title, details, dueDate, priority) => {
        const obj = homeTask[index];
        obj.title = title;
        obj.details = details;
        obj.dueDate = dueDate;
        obj.priority = priority;
    };

    // Check Task

    const checkedTask = (index, isCheck) => {
        homeTask[index].checked = isCheck;
    };

    return { homeTask, AddTask, delTask, editTask, checkedTask };
}
