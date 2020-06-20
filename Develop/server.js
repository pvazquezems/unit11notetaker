 // IMPORTING NPM PACKAGES WE NEED TO HAVE PATHS TO URL AND EXPRESS FRAMEWORK
const fs = require("fs");
const path = require("path");
const express = require("express"); 
 // SETTING UP INITIAL PORT
const app = express();
const PORT = process.env.PORT || 8080;

 // CODE BELOW POINTS THE SERVER TO DIFFERENT ROUTES. TELLING OUR SERVER HOW TO RESPOND WHEN USER VISITS OR REQUEST DATA FROM DIFF URL.
app.get("/notes", (req, res) => res.sendFile(__dirname + "/public/notes.html"));
app.get("/", (req, res) => res.sendFile(__dirname + "/public/index.html"));
app.get("/notes", (req, res) => res.sendFile(__dirname + "/public/assets/css/styles.css"));
app.get("/notes", (req, res) => res.sendFile(__dirname + "/public/assets/js/index.js"));
 // SETTING UP THE EXPRESS APP FOR DATA PARSING
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
 // API GET REQUEST, BELOW CODE HANDLES WHEN USER "VISITS" A PAGE.
app.get("/api/notes", (req, res) => {
 // "READING" DATA BEING PASSED IN
  fs.readFile(__dirname + "/db/db.json", (err, data) => { 
    if (err) throw err;
 // SETTING DATA IN VARIABLE    
    let noteOne = JSON.parse(data);
    res.json(noteOne);
  })
}); 
 // API POST REQUEST, BELOW CODE HANDLES WHEN A USER SUBMITS A FROM AND THUS SUBMITS DATA TO SERVER.
app.post("/api/notes", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => { 
    if (err) throw err;
    let notes = JSON.parse(data)
 // DECONSTRUCTING NOTE DATA   
    let newNote = {
      id: notes.length +1,
      title: req.body.title,
      text: req.body.text,
    }
 // PUSHING NEWNOTES INTO NOTES 
    notes.push(newNote)
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err, data) => {
      if (err) throw err;
      res.json(notes)      
    }); 
  });
});
// API GET REQUEST, BELOW CODE HANDLES WHEN USER "CLICKS" ON A CERTAIN NOTE TITLE
app.get("/api/notes/:title", (req, res) => {
  fs.readFile(__dirname + "/db/db.json", (err, data) => { 
    if (err) throw err;
    let noteOne = JSON.parse(data);
 // FILTERING MAKING SURE THE RIGHT DATA IS BEING RES.
    notes = noteOne.filter(data => {
      return data.title.toLowerCase() === req.params.title.toLowerCase()
    }); 
    res.json(notes);
  })
});
 // API DELETE REQUEST, BELOW CODE HANDLES WHEN USER "CLICKS" ON DELETE BTN.
app.delete("/api/notes/:id", (req, res) => {
 // GETTING JSON OBJECT VIA ID FROM DATABASE.
  fs.readFile(__dirname + "/db/db.json", "utf8", (err, data) => { 
    if (err) throw err;
    let notes = JSON.parse(data)
    const note = notes.find(n => n.id === parseInt(req.params.id));
    const noteIndex = notes.indexOf(note);
    notes.splice(noteIndex, 1);
 // UPDATING DATABASE FILE.
    fs.writeFile(__dirname + "/db/db.json", JSON.stringify(notes), (err, data) => {
      if (err) throw err;
      res.json(notes)    
    }); 
  });
});
// CODE THAT STARTS OUR SERVER
app.listen(PORT, function() {
  console.log("SERVER IS LISTENING ON PORT: " + PORT);
});