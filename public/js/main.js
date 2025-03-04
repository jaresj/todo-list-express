// Storing all elements in the dom with class '.fa-trash' in a node list
const deleteBtn = document.querySelectorAll('.fa-trash');

// Storing all paragraph elements inside '.item' class inside a node list
const item = document.querySelectorAll('.item p');

// Storing all paragraph elements inside '.item' class that also have a completed class inside a node list
const itemCompleted = document.querySelectorAll('.item p.completed');

// Creating an array from the node list 'deleteBtn', then assigning each with an event listener that goes to function 'deleteItem'
Array.from(deleteBtn).forEach((element) => {
  element.addEventListener('click', deleteItem);
});

// Creating an array from the node list 'item', then assigning each an event listener that goes to function 'markCompleted'
Array.from(item).forEach((element) => {
  element.addEventListener('click', markComplete);
});

// Creating an array from the node list 'itemCompleted', then assigning each an event listener that goes to function 'markUnComplete'
Array.from(itemCompleted).forEach((element) => {
  element.addEventListener('click', markUnComplete);
});

// An async function to delete the todo item associated with the delete icon we clicked
async function deleteItem() {
  // We're gettung the text of the todo-item and saving it in variable 'itemText'
  const itemText = this.parentElement.children[0].innerText;
  try {
    // Sending a delete request to the server with the following parameters
    const response = await fetch('deleteItem', {
      // Specifying that this is a delete request
      method: 'delete',
      headers: { 'Content-Type': 'application/json' },
      // Defining the key 'itemFromJS' as the text from the to-do item
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Waiting for a response from the server
    const data = await response.json();
    // console logging the servers response
    console.log(data);
    // Reloading the page
    location.reload();
    // Error Catch
  } catch (err) {
    console.log(err);
  }
}

// An async function to mark a todo item as complete
async function markComplete() {
  // Getting the text of the todo item and storing it in itemText
  const itemText = this.parentElement.children[0].innerText;
  // Sending a put request to the server to mark the item as compelete
  try {
    const response = await fetch('markComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      // Defining the key 'itemFromJS' as the text from the to-do item
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Waiting for a response from the server
    const data = await response.json();
    // Console logging the server's response
    console.log(data);
    // Reloading the page
    location.reload();
    // Error catch
  } catch (err) {
    console.log(err);
  }
}

// An async function to mark a todo item as uncomplete
async function markUnComplete() {
  // Getting the text of the todo item and storing it in
  const itemText = this.parentElement.children[0].innerText;
  try {
    // Sending a put request to the server to mark the item as uncomplete
    const response = await fetch('markUnComplete', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemFromJS: itemText,
      }),
    });
    // Waiting for a response from the server
    const data = await response.json();
    // Console logging the server's response
    console.log(data);
    // Reloading the page
    location.reload();

    // Error catch
  } catch (err) {
    console.log(err);
  }
}
