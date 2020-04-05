// Create new array for our shopping list
// Each list item will be included in this array as an object with 2 properties, one for text and another one for the status
let shoppingList = new Array;

getExistingList();

// get existing list items from the localStorage 
// if there are any present run fillAndDisplayList to populate the list
function getExistingList () {
    // If there are list items in storage :
    if (localStorage.getItem('shoppingListItems')){
        console.log('there is stuff in local storage');
        // Save parse the string into an usable object and save it in the shoppingList array
        shoppingList = JSON.parse(localStorage.getItem('shoppingListItems'));
        // Populate the list with the storage data
        fillAndDisplayList();
        return;
    } else {
        // If NO todos in storage - continue
        return 'You do not have any list items now \nclick the "+" button to add more';
    }
}

function addNewItem(){
    // Only add a new list item if there is a value in the input
    const newestListItem = document.querySelector('#item-to-add').value;
    if(newestListItem){
        // create an object with the input value as text
        // and a default of not checked
        const listObject = {
        text : newestListItem,
        isItDone : false 
        }
        // add the new list item to the shopping list array
        shoppingList.push(listObject);
        // overwrite the list in the storage
        localStorage.setItem('shoppingListItems', JSON.stringify(shoppingList));
        // run the populate list function
        fillAndDisplayList();
      
    } else {
        // display error cause empty
        // TODO: display this error for user
        return 'You must write something in the box';
    }
}

// Populates the list in the HTML
function fillAndDisplayList () {
    // Delete the current list ;
    const list = document.querySelector('#list')
    list.innerHTML = '';
    // Create a new item in the list for every item in the shoppingList array
    if (shoppingList){
        shoppingList.forEach(item =>{
            const condition = item.isItDone;
            itemWrapper = document.createElement('div');
            itemWrapper.classList.add('itemWrapper');
            // for the condition, we only want to add a class if it is not done yet, also false
            //   if it is true we don"t add an additional class
            itemWrapper.innerHTML = `
            <div class="itemText">${item.text}</div>
            <div class="checkbox ${condition == false ? 'notdoneyet': ''}"></div>
            `
            list.appendChild(itemWrapper);
            updateStrikethrough();
            return;
        })
    } 
  // We call update boxes here because we want our query selector to select the newly created boxes too
  updateCheckBoxes()
}

// if a box is clicked, update the information of the list and display it in the page
// This function is executed every time the list is populated, in order to get the new boxes
function updateCheckBoxes () {
    let boxes = document.querySelectorAll('.checkbox');
    boxes.forEach((box, i) => {
        box.addEventListener('click', e => {
            // toggle the notdoneyet class on and off
            box.classList.toggle('notdoneyet');
            if(box.classList.contains('notdoneyet')){
                // this box should be set to false in the array
                shoppingList[i].isItDone = false;
            } else {
                // this box should be set to true in the array
                shoppingList[i].isItDone = true;
            }
            // update localStorage as well (not only the array)
            localStorage.setItem('shoppingListItems', JSON.stringify(shoppingList));
            updateStrikethrough();
        })
    })
  return;
}

// This function will get the corresponding text of every checked box and strike it through
function updateStrikethrough() {
    //get boxes
    let boxes = document.querySelectorAll('.checkbox');
    boxes.forEach(box => {
        if(!box.classList.contains('notdoneyet')){
            // if the box doesn't contain the 'notdoneyet' class
            // add the class 'marked' to the parent element to strike through the text
            box.parentElement.classList.add('marked');
        } else if (box.classList.contains('notdoneyet')) {
            // if the box contains the 'notdoneyet' class
            // add the remove 'marked' to the parent element to not to be striked through
            box.parentElement.classList.remove('marked');
        }
    })
    return;
}

// *** Add (+) Button *** //
// if addButton (+) is clicked then run addNewItem and reset the value of the input field
document.querySelector('#add-button').addEventListener('click', e=>{
    // prevent default is necessary because the button is inside a form.
    // we do not want to reload the page
    e.preventDefault();
    addNewItem();
    // reset the input value to make it more user friendly
    document.querySelector('input').value = ''
})

// *** Mark All as completed Button *** //
// if markAll is clicked then remove the 'notdoneyet' class from all the list items and update the list and localstorage
document.querySelector('#markAllCompleted').addEventListener('click', e=>{
    e.preventDefault();
    let boxes = document.querySelectorAll('.checkbox');
    boxes.forEach((box, i) => { 
        box.classList.remove('notdoneyet');
        // this box should be set to true in the array
        shoppingList[i].isItDone = true;
        // update the localStorage
        localStorage.setItem('shoppingListItems', JSON.stringify(shoppingList));
        updateStrikethrough();
    })
})

// *** Clear All Button *** //
// if clear all is clicked then update the array and localStorage and repopulate the list
document.querySelector('#clearCompleted').addEventListener('click', e=>{
    e.preventDefault();
    // selects all the items that have their isItDone property set to false. Others are ignored, redefining the array
    shoppingList = shoppingList.filter(item => item.isItDone == false );
    // update the localStorage
    localStorage.setItem('shoppingListItems', JSON.stringify(shoppingList));
    fillAndDisplayList();
})