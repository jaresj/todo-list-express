// Requiring Express
const express = require('express');
// Save express call to the 'app' variable
const app = express();
// Requiring MongoDB
const MongoClient = require('mongodb').MongoClient;
// Declaring port variable
const PORT = 2121;
// Requiriing dotenv
require('dotenv').config();

let db, // Declaring an empty 'db' variable
  dbConnectionStr = process.env.DB_STRING, // a connection string variable that gets the string from .env or heroku's variables
  dbName = 'todo'; // Decalring the name of the database to the 'dBName' variable

// Connecting to the database
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// Setting EJS
app.set('view engine', 'ejs');
// Setting up the public folder
app.use(express.static('public'));
// Telling express to decode and encode URLs automatically
app.use(express.urlencoded({ extended: true }));
// Tells express to use JSON
app.use(express.json());

// Responding to a get request to the '/' route
app.get('/', async (request, response) => {
  // Getting to do items from the database
  const todoItems = await db.collection('todos').find().toArray();
  // Getting items with a 'completed' value of 'false'
  const itemsLeft = await db
    .collection('todos')
    .countDocuments({ completed: false });
  // Sending over the vairable toDoItems and itemsLeft to EJS
  response.render('index.ejs', { items: todoItems, left: itemsLeft });
  // db.collection('todos').find().toArray()
  // .then(data => {
  //     db.collection('todos').countDocuments({completed: false})
  //     .then(itemsLeft => {
  //         response.render('index.ejs', { items: data, left: itemsLeft })
  //     })
  // })
  // .catch(error => console.error(error))
});

// Responding to a post request to the /"addTodo" route
app.post('/addTodo', (request, response) => {
  // Inserting a new todo item into the list
  db.collection('todos')
    .insertOne({ thing: request.body.todoItem, completed: false })

    // Console logging thast the todo list was added, then telling client to refresh the apge
    .then((result) => {
      console.log('Todo Added');
      response.redirect('/');
    })
    // Console log errors if they occur
    .catch((error) => console.error(error));
});

// Responding to an update request to mark an item complets
app.put('/markComplete', (request, response) => {
  // Going into database, collection 'todos', and finding a document that matches request
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: true, // set item completed value to true
        },
      },
      {
        sort: { _id: -1 }, // Sort in decending order, giving you the highest ID first
        upsert: false, // if itemFromJS doesn't exsist don't create a new one
      }
    )
    // console logging that it's been marked compete, and also respoinding back to tthe client in JSON, saying it's been marked complete
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    // Error catch
    .catch((error) => console.error(error));
});

// Responding to update a request to mark an item uncomplete
app.put('/markUnComplete', (request, response) => {
  db.collection('todos')
    .updateOne(
      { thing: request.body.itemFromJS },
      {
        $set: {
          completed: false, // set item completed value to false
        },
      },
      {
        sort: { _id: -1 }, // Sort in decending order, giving you the highest ID first
        upsert: false,
      }
    )
    // console logging that it's been marked uncomplete, and also respoinding back to the client in JSON, saying it's been marked uncomplete
    .then((result) => {
      console.log('Marked Complete');
      response.json('Marked Complete');
    })
    // Error Catch
    .catch((error) => console.error(error));
});

// Responding to a request to delete an item from the list
app.delete('/deleteItem', (request, response) => {
  // Going into the database and delelting the item that matches request.body.itemFromJS
  db.collection('todos')
    // Console logging and responding to the client that the item has been deleted
    .deleteOne({ thing: request.body.itemFromJS })
    .then((result) => {
      console.log('Todo Deleted');
      response.json('Todo Deleted');
    })
    // Error Catch
    .catch((error) => console.error(error));
});

//Setting the server to listen to requests
app.listen(process.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
