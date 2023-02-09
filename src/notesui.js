import Notes from './notes';
import Storage from './localstorage';

export default function NotesTab() {
    const note = Notes();
    const storage = Storage();
    const { notesList } = note;
    const content = document.querySelector('.content');
    const notesSideBarBtn = document.querySelector('.notes');
    notesSideBarBtn.style.cursor = 'pointer';
    notesSideBarBtn.addEventListener('click', renderNotesContent);

    storage.checkLocalStorage(notesList, 'notes');

    function renderNotesContent() {
        notesSideBarBtn.parentElement.className = 'sidebar disable'; // Collapsed Sidebar for compact width
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
                style: 'display:grid; grid-template-columns: repeat( auto-fill, minmax(250px, 1fr));gap: 20px',
            })
                .appendChild(
                    Object.assign(div, {
                        style: 'padding: 15px;display:flex; background-color:var(--secondary-contentcolor); flex-direction:column; gap:10px; border-radius:5px;',
                    })
                )
                .append(
                    Object.assign(inputTitle, {
                        contentEditable: true,
                        value: item.title,
                        placeholder: 'Title',
                        style: 'border:none;background-color:var(--secondary-contentcolor); padding: 5px',
                    }),
                    Object.assign(textAreaContent, {
                        contentEditable: true,
                        textContent: item.content,
                        placeholder: 'Content',
                        rows: '10',
                        style: 'resize:none; border:none; background-color:var(--secondary-contentcolor); padding: 5px',
                    }),
                    Object.assign(delBtn, {
                        textContent: 'Delete',
                        style: 'align-self:flex-end; padding:10px; border-color: var(--cancel-btn)',
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
        note.AddNote('', '');
        storage.updateLocalStorage(notesList, 'notes');
        notesSideBarBtn.click();
    }

    function editTitle(event) {
        const getNoteIndex =
            event.target.parentElement.getAttribute('data-note-index');
        note.editTitle(getNoteIndex, event.target.value);
        storage.updateLocalStorage(notesList, 'notes');
    }

    function editContent(event) {
        const getNoteIndex =
            event.target.parentElement.getAttribute('data-note-index');
        note.editContent(getNoteIndex, event.target.value);
        storage.updateLocalStorage(notesList, 'notes');
    }

    function delNote(event) {
        const getNoteIndex =
            event.target.parentElement.getAttribute('data-note-index');
        note.delNote(getNoteIndex);
        storage.updateLocalStorage(notesList, 'notes');
        notesSideBarBtn.click();
    }

    notesSideBarBtn.click();
}
