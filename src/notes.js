export default function Notes() {
    const notesList = [];

    function AddNote(title, content) {
        notesList.push({ title, content });
    }

    function editTitle(index, title) {
        const noteObj = notesList[Number(index)];
        noteObj.title = title;
    }

    function editContent(index, content) {
        const noteObj = notesList[Number(index)];
        noteObj.content = content;
    }

    function delNote(index) {
        notesList.splice(Number(index), 1);
    }

    return { notesList, AddNote, editTitle, editContent, delNote };
}
