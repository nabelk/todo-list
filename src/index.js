import _ from 'lodash';
import HomeTab from './homeui';
import Screen from './ui';
import NotesTab from './notesui';

NotesTab();
Screen();
HomeTab();

// Script for side when display width becomes compact

const enableSidebar = document.querySelector('button.enable-sidebar');
const sidebar = document.querySelector('div.sidebar');
document.querySelector('.content').addEventListener('click', disableSidebar);

function disableSidebar() {
    sidebar.className = 'sidebar disable';
}

enableSidebar.addEventListener('click', () => {
    if (sidebar.classList.contains('disable')) {
        sidebar.className = 'sidebar enter';
    } else {
        sidebar.className = 'sidebar disable';
    }
});
