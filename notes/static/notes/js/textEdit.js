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
        choose_style();
    }
    if(key === 9){
        event.preventDefault();
        create_nested();
        return false;
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

function create_heading(tag, content){
    //gets input element and selection as reference
    const input = document.querySelector('#style');
    const selection = window.getSelection();

    let text_node;
    const heading = document.createElement(tag);
    //if no content is selected
    if(content === null){
       text_node = document.createTextNode(">");
       heading.appendChild(text_node);
    }else{
        const text = content;
        input.nextSibling.remove();
        text_node = document.createTextNode(text);
        heading.appendChild(text_node);
    }

    //inserts heading element in document right bellow input element
    input.parentElement.insertAdjacentElement('afterEnd', heading);
    //moves caret to new element
    selection.collapse(text_node, text_node.textContent.length);
    return;
}

function create_nested(){
    console.log("create nested");
    const selection = window.getSelection();

    // gets first parent element 
    let element = selection.anchorNode;
    if (element.nodeType !== 1){
        element = element.parentElement;
    }
    //gets tag type of parent element
    let tag = element.tagName;

    if(tag === "SPAN"){
        element = element.parentElement;
        tag = element.tagName;
    }

    console.log(tag);
    //if its a div, apends current as child of previous div.
    if(tag === "DIV"){
        let parent = element.previousElementSibling;
        parent.append(element);
        selection.setPosition(element.lastChild, element.lastChild.length -1);
    }
    //if its list
    if(tag === "LI"){
        const list_tag = element.parentElement.tagName;
        let parent = element.previousElementSibling;
        let sublist = document.createElement(list_tag.toLowerCase());
        sublist.appendChild(element);
        parent.append(sublist);
        selection.setPosition(element.lastChild, element.lastChild.length -1);
    }
}

function choose_style(){
    const selection = window.getSelection();
    let content = null;
    if(selection.type !== "Caret"){
        content = selection.toString();
    }

    const range = selection.getRangeAt(0);

    const input = document.createElement('input');
    input.id = "style";
    input.setAttribute('list', 'styles');
    //if enter key is pressed set style
    input.addEventListener('keypress', e =>{
        const key = e.key;
        if(key === "Enter"){
            set_style(content);
        }
    })
    // if focus out delete this element
    input.addEventListener('blur', () => input.remove())
    input.setAttribute('data-content', content)
    range.insertNode(input);
    input.focus();
}

function set_style(content){
    const style = document.querySelector("#style");
    switch (style.value) {
        case "#list":
            create_list('ul');
            break;
        case "#numbered list":
            create_list('ol');
            break;
        case "#h2": case"#h3": case"#h4":
            create_heading(style.value.replace('#', ''), content);
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