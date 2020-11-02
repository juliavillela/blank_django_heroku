var current_note_id = 0;

document.addEventListener('DOMContentLoaded', function() {

    //on click on event no in list, load note:
    const notes = document.getElementsByClassName("note-button");
    for(let i=0; i<notes.length; i++){
        console.log(`DATASET NOTE ID: ${notes[i].dataset.id} `)
        notes[i].addEventListener('click', () => load(notes[i].dataset.id));
    }
});

//sends put request to save updates to note content
function save(){

    const current_content = document.querySelector("#note-content").innerHTML;
    //push into json
    const update = {"content": current_content};
    const url = `note/${current_note_id}`;
    
    const request = new Request (url, {
        method: 'PUT',
        body: JSON.stringify(update),
        headers: {
        'Content-Type': 'application/json'
        }
    });

    fetch(request)
    .then(response => response.json())
    .then(r => {
        return console.log(r.status);
    })
    .catch(error => console.log(error));
}

//fetches note json and calls display to render 
function load(note_id){
    fetch(`note/${note_id}`)
    .then(response => response.json())
    .then(note_obj => {
        current_note_id = note_obj.id;
        display(note_obj);
        console.log(`loading:${note_obj.title}`);
    })
    .catch(error => console.log(error));
}

//formats json object for display
function display(note_obj){
    //clear content div
    const content = document.querySelector("#content");
    content.innerHTML = "";

    //create elements for note structure
    const title = document.createElement('h1');
    const description = document.createElement('p');
    const note_content = document.createElement('div');
    
    title.id = "title";
    title.innerHTML = note_obj.title;
    content.append(title);

    description.id = "description";
    description.innerHTML = note_obj.description;
    content.append(description);

    note_content.id = "note-content";
    note_content.innerHTML = note_obj.content;

    //set event listeners on all elements of note content
    const elements = note_content.children;
    for(let i=0; i<elements.length; i++){
        elements[i].contentEditable = true;
        elements[i].addEventListener('keydown', e => typing_short_cuts(e));
        elements[i].addEventListener('blur', () => save());
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
        method : 'POST',
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

function typing_short_cuts(event){
    const key = event.keyCode || event.key;
    console.log(key)
    //enter
    if (key === 13){
        event.preventDefault();
        if (event.ctrlKey === false) {
            line_break();
            return false;
        }else{
            console.log("paragraph break!")
            paragraph_break();
            return false;
        }
    }
    //backspace
    if(key === 08){
        delete_empty_div()
    }
}

//on keydown enter
//creates new div, in the same level right bellow current div.
//splits text if any
function line_break(){
    const selection = window.getSelection();
    let range = selection.getRangeAt(0);
    const lb = document.createElement('br');
    range.insertNode(lb);
    let new_anchor = selection.anchorNode.nextSibling
    //if there is already a text node bellow line break:
    if(new_anchor.newtSibling && new_anchor.nextSibling.nodeType === 3) {
        selection.setPosition(new_anchor.nextSibling, 0);
    //if not, inserts a text node at the end of the break node and then moves there
    }else{
        selection.setPosition(new_anchor, new_anchor.length)
        const new_line = document.createTextNode("");
        let range = selection.getRangeAt(0);
        range.insertNode(new_line);
        selection.setPosition(selection.anchorNode.nextSibling, 0);
    }
}

function paragraph_break(){
    const selection = window.getSelection();
    let element = selection.anchorNode.parentElement;
    let new_par = new_paragraph();

    //get text in selection node, which comes after the caret. 
    //and carry it over to the next paragraph
    let next = selection.anchorNode;
    text = next.splitText(selection.anchorOffset);
    next = next.nextSibling;
    let copy = next.cloneNode(true);
    new_par.appendChild(copy);
    next = next.nextSibling;

    //then carry over any remaining nodes in the div
    while (next !== null) {
        next.previousSibling.remove();
        let copy = next.cloneNode(true);
        new_par.appendChild(copy);
        next = next.nextSibling;
    }
    //insert new paragraph with content just after previous paragraph
    element.insertAdjacentElement('afterEnd', new_par);
    //move focuse to new paragraph
    new_par.focus();
}

function delete_empty_div(){
    const active = document.activeElement;
    const active_nodes = active.childNodes;
    if(active_nodes !== null){
        for(let i=0; i<active_nodes.length; i++){
            if (active_nodes[i].textContent !== ""){
                return;
            }
        }
        let prev = active.previousElementSibling;
        active.remove();
        prev.focus();
    }
}

//creates empty div with eventlisteners and attr.
function new_paragraph(){
    const newpar = document.createElement('div');
    newpar.addEventListener('blur', () => save());
    newpar.addEventListener('keydown', e => typing_short_cuts(e));
    newpar.contentEditable = true;
    return newpar;
}