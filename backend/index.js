const express = require("express");
const bodyParser = require("body-parser");
const app = express();

const PORT = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

let lists = {
    "0000000001": {
        id: "0000000001",
        title: "First List",
        todos: ["First todo of first list!"]
    },
    "0000000002": {
        id: "0000000002",
        title: "Second List",
        todos: ["First todo of second list!"]
    }
};

app.get("/", (req, res) => res.send("Hello World!"));

// Get lists on page realod
app.get("/lists", (req, res) => {
    res.send(lists);
});

// Update todos in list given by id
app.put("/addlists/:id", (req, res) => {
    lists[req.body.id].todos = req.body.todos;
    // res.send(lists[req.body.id]);
});

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));
