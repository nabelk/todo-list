import Notes from './notes';

export default function NotesTab() {
    const note = Notes();
    const { notesList } = note;
    const content = document.querySelector('.content');
    const notesSideBarBtn = document.querySelector('.notes');
    notesSideBarBtn.style.cursor = 'pointer';
    notesSideBarBtn.addEventListener('click', renderNotesContent);

    function renderNotesContent() {
        console.table(notesList);

        content.textContent = '';
        const addNoteBtn = document.createElement('button');
        const notesContent = document.createElement('div');
        notesList.forEach((item, index) => {
            const div = document.createElement('div');
            const delBtn = document.createElement('button');
            const inputTitle = document.createElement('input');
            const textAreaContent = document.createElement('textarea');
            div.setAttribute('data-note-index', index);
            Object.assign(notesContent, {
                style: 'display:grid; grid-template-columns: repeat( auto-fill, minmax(300px, 1fr));gap: 20px',
            })
                .appendChild(
                    Object.assign(div, {
                        style: 'padding: 15px;display:flex; background-color:grey; flex-direction:column; gap:10px; border-radius:5px;',
                    })
                )
                .append(
                    Object.assign(inputTitle, {
                        contentEditable: true,
                        value: item.title,
                        placeholder: 'Title',
                        style: 'border:none; background-color:grey; padding: 5px',
                    }),
                    Object.assign(textAreaContent, {
                        contentEditable: true,
                        textContent: item.content,
                        placeholder: 'Content',
                        rows: '10',
                        style: 'resize:none; border:none; background-color:grey; padding: 5px',
                    }),
                    Object.assign(delBtn, {
                        textContent: 'Delete',
                        style: 'align-self:flex-end',
                    })
                );
            delBtn.addEventListener('click', delNote);
            inputTitle.addEventListener('input', editTitle);
            textAreaContent.addEventListener('input', editContent);
        });
        content.append(
            Object.assign(addNoteBtn, {
                textContent: '➕ Note',
                className: 'add-note-btn',
            }),
            Object.assign(notesContent, {
                className: 'notes-content',
            })
        );
        addNoteBtn.addEventListener('click', addNote);
    }

    function addNote() {
        note.AddNote('Title', 'Content');
        notesSideBarBtn.click();
    }

    function editTitle(event) {
        const getNoteIndex =
            event.target.parentElement.getAttribute('data-note-index');
        note.editTitle(getNoteIndex, event.target.value);
    }

    function editContent(event) {
        const getNoteIndex =
            event.target.parentElement.getAttribute('data-note-index');
        note.editContent(getNoteIndex, event.target.value);
    }

    function delNote(event) {
        const getNoteIndex =
            event.target.parentElement.getAttribute('data-note-index');
        note.delNote(getNoteIndex);
        notesSideBarBtn.click();
    }

    notesSideBarBtn.click();
}
