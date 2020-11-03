//holds value of currently opened note
var current_note_id = 0;

//adds event listeners to note links in index
document.addEventListener('DOMContentLoaded', function() {

    //on click on event no in list, load note:
    const notes = document.getElementsByClassName("note-button");
    for(let i=0; i<notes.length; i++){
        console.log(`DATASET NOTE ID: ${notes[i].dataset.id} `)
        notes[i].addEventListener('click', () => load(notes[i].dataset.id));
    }
});


//fetches content and calls display for note
function load(note_id){
    //fetch content
    fetch(`note/${note_id}`)
    .then(response => response.json())
    .then(note_obj => {
        //update global var
        current_note_id = note_obj.id;
        //display
        display(note_obj);
        //debugginglog
        console.log(`loading:${note_obj.title}`);
    })
    .catch(error => console.log(error));
}

function save(){

    const current_content = document.querySelector("#note-content").innerHTML;
    const update = {"content": current_content};
    const url = `note/${current_note_id}`;

    const request = new Request (url, {
        method: 'PUT',
        body: JSON.stringify(update),
        headers: {
            'Content-Type': 'application/json'
        }
    })

    fetch(request).then(response => response.json()).then(r => console.log(r))
    .catch(error => console.log(error));
}

//renders note_obj in correct format
function display(note_obj){
    //clear content div
    const content = document.querySelector("#content");
    content.innerHTML = "";

    //creates basic display elements
    const title = document.createElement('h1');
    const description = document.createElement('p');
    const note_content = document.createElement('div');


    title.id = "title";
    title.innerHTML = note_obj.title;
    content.append(title);

    description.id = "description";
    description.innerHTML = note_obj.description;
    content.append(description);

    //set innerHtml of content to db obj content
    note_content.id = "note-content";
    note_content.innerHTML = note_obj.content;
    note_content.contentEditable = true;
    note_content.addEventListener('keydown', e => shortcut(e))
    note_content.addEventListener('blur', () => save());
    
    const paragraphs = note_content.children;
    for(let i=0; i<paragraphs.length; i++){
        paragraphs[i].removeAttribute('contentEditable');
    }
    content.append(note_content);
}

//loads new_note "page" and calls create note
function new_note(){
    const title = document.createElement('h1');
    title.innerHTML = "Give your note a title"
    title.id = "title-input";
    title.contentEditable = true;
    title.addEventListener('focusin', () => title.innerHTML="");
    title.addEventListener('focusout', () => {
        if(title.innerHTML !== ""){
            create_note(title.innerHTML)
        }
        });
    document.querySelector("#content").innerHTML = "";
    document.querySelector("#content").append(title);
}

//adds note to db and displays it in edit mode useing load function
function create_note(title){
    const content = {
        title: title,
        content: "<div>type here</div>"
    }
    const url = "/create";

    request = new Request( url, {
        method: 'POST',
        body: JSON.stringify(content),
        headers: {
            'Content-Type': 'application/json'
            }
    });

    fetch(request)
    .then(response => response.json())
    .then(r => {
        console.log(r);
        load(r.id);
    })
    .catch(error => console.log(error));
}

function shortcut(event){
    const key = event.keyCode || event.key;

    if(key === 51){
        choose_style()
    }
}

//Enter key creates a new par.
// it has no attr o classes

//creates ul and appends to current div
function create_list(tag){
    const input = document.querySelector('#style');
    const selection = window.getSelection();
    
    const list = document.createElement(tag);
    const item = document.createElement('li');
    list.append(item);

    input.parentElement.insertAdjacentElement('afterEnd', list);
    selection.setPosition(item, 0);
}

function create_heading(tag){
    const input = document.querySelector('#style')
    const selection = window.getSelection();

    const text_node = document.createTextNode("Heading");
    const heading = document.createElement(tag);
    heading.appendChild(text_node);

    input.parentElement.insertAdjacentElement('afterEnd', heading);
    
    selection.setPosition(text_node, 0);
}

// function choose_style(){
//     const selection = window.getSelection();
//     const content = document.querySelector("#note-content");
//     const el = selection.anchorNode.parentElement;
    
//     const input = document.createElement('input');
//     input.id = "style";
//     input.addEventListener('blur', () => set_style())
//     input.setAttribute('list', 'styles');
    
//     el.insertAdjacentElement('beforeEnd', input);
//     input.focus();
// }

function choose_style(){
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);

    const input = document.createElement('input');
    input.id = "style";
    input.setAttribute('list', 'styles');
    //if enter key is pressed set style
    input.addEventListener('keypress', e =>{
        const key = e.key;
        if(key === "Enter"){
            set_style()
        }
    })
    // if focus out delete this element
    input.addEventListener('blur', () => input.remove())

    range.insertNode(input);
    input.focus();
}

function set_style(){
    const style = document.querySelector("#style");
    switch (style.value) {
        case "#list":
            create_list('ul');
            break;
        case "#numbered list":
            create_list('ol');
            break;
        case "#h2": case"#h3": case"#h4":
            create_heading(style.value.replace('#', ''));
            break;
        default:
            alert("no such style")
            console.log("default")
            break;
    }
    if (style){
       style.remove();
    }
}
