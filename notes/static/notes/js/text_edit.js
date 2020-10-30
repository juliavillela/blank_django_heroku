document.addEventListener('DOMContentLoaded', function() {

    //on click on event no in list, load note:
    const notes = document.getElementsByClassName("note-button");
    for(let i=0; i<notes.length; i++){
        console.log(`DATASET NOTE ID: ${notes[i].dataset.id} `)
        notes[i].addEventListener('click', () => load(notes[i].dataset.id));
    }
});


function save(note_id){
    const current_content = document.querySelector("#note-content").innerHTML;
    //push into json
    const update = {"content": current_content};
    const url = `note/${note_id}`;
    
    const request = new Request (url, {
        method: 'PUT',
        body: JSON.stringify(update),
        headers: {
        'Content-Type': 'application/json'
        }
    });
    fetch(request)
    .then(response => response.json())
    .then(r => console.log(r))
    .catch(error => console.log(error)); 
}

function load(note_id){
    console.log(`NOTE ID: ${note_id}`)
    fetch(`note/${note_id}`)
    .then(response => response.json())
    .then(note_obj => {
        display(note_obj)
        console.log(note_obj.title)
    })
    .catch(error => console.log(error))
}

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
        elements[i].addEventListener('blur', () => save(note_obj.id));
    }
    content.append(note_content);
}

function add_paragraph(){
    const new_element = document.createElement('p');
    new_element.addEventListener('keyup', () => set_type(new_element))
}

function set_type(element){
    const text = element.innerHTML
    if(match(/\/w*\//, text)){
        console.log(match)
    }else{
        element.className = "regular";
    }
}