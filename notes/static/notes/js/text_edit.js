document.addEventListener('DOMContentLoaded', function() {

    // Use buttons to toggle between views
    const add_buttons = document.getElementsByClassName('add-content');
    for(let i = 0; i < add_buttons.length; i++){
        add_buttons[i].addEventListener('click', () => show_textbox(event.target));
    }
    const content = document.querySelector("#content").children
    for(let i=0; i<content.length; i++){
        content[i].addEventListener('click', () => toggle_edditable(event.target, true));
        content[i].addEventListener('blur', () => toggle_edditable(event.target, false));
    }
});

function show_textbox(element){
    const textbox = document.createElement('textarea');
    element.append(textbox);
}

function toggle_edditable(element, value){
    element.contentEditable = value;
}