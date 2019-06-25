import React, { useState } from "react";
import { makeStyles } from "@material-ui/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import Typography from "@material-ui/core/Typography";
import Checkbox from "@material-ui/core/Checkbox";
import { TextField } from "../../shared/FormFields";

const useStyles = makeStyles({
    card: {
        margin: "1rem"
    },
    todoLine: {
        display: "flex",
        alignItems: "center"
    },
    textField: {
        flexGrow: 1

        /** Tried to change textDecoration depending on checkboxes */
        // textDecoration: toDoList.todos.indexOf(x => x.checked)
        //     ? "line-through"
        //     : "none"
    },
    standardSpace: {
        margin: "8px"
    },
    form: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1
    }
});
// Variable to use for autosave functionality
// let waitSave = 0;

export const ToDoListForm = ({ toDoList, saveToDoList }) => {
    const classes = useStyles();
    const [todos, setTodos] = useState(toDoList.todos);

    const updateLists = async () => {
        /** Tried to saveToDoList in here before PUT to make the autosave work on time
         * Also clear waitSave */
        // saveToDoList(toDoList.id, { todos });
        // if (waitSave) clearTimeout(waitSave);

        const response = await fetch("/lists/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                id: toDoList.id,
                todos: todos
            })
        });
        const body = await response.text();
        console.log(body);
    };

    const handleSubmit = event => {
        event.preventDefault();

        saveToDoList(toDoList.id, { todos });

        // PUT new todos to list on server given by id
        updateLists();
    };

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="headline" component="h2">
                    {// Add "Done" to list title if all todos are checked
                    todos.every(x => x.checked)
                        ? toDoList.title + " - Done"
                        : toDoList.title}
                </Typography>
                <form onSubmit={handleSubmit} className={classes.form}>
                    {todos.map((todo, index) => (
                        <div key={index} className={classes.todoLine}>
                            <Checkbox
                                checked={todo.checked}
                                onChange={event => {
                                    setTodos([
                                        // immutable update
                                        ...todos.slice(0, index),
                                        {
                                            name: todo.name,
                                            checked: event.target.checked
                                        },
                                        ...todos.slice(index + 1)
                                    ]);
                                }}
                                value="check"
                                color="primary"
                                inputProps={{
                                    "aria-label": "primary checkbox"
                                }}
                            />
                            <Typography
                                className={classes.standardSpace}
                                variant="title"
                            >
                                {index + 1}
                            </Typography>
                            <TextField
                                label="What to do?"
                                value={todo.name}
                                onChange={event => {
                                    /** Resetting waitSave on every click */
                                    // if (waitSave) clearTimeout(waitSave);

                                    setTodos([
                                        // immutable update
                                        ...todos.slice(0, index),
                                        {
                                            name: event.target.value,
                                            checked: todo.checked
                                        },
                                        ...todos.slice(index + 1)
                                    ]);

                                    /** Waiting 2 seconds then calling updatLists to PUT to server */
                                    // waitSave = setTimeout(updateLists, 2000);
                                }}
                                className={classes.textField}
                            />
                            <Button
                                size="small"
                                color="secondary"
                                className={classes.standardSpace}
                                onClick={() => {
                                    /** Resetting waitSave on every click */
                                    // if (waitSave) clearTimeout(waitSave);

                                    setTodos([
                                        // immutable delete
                                        ...todos.slice(0, index),
                                        ...todos.slice(index + 1)
                                    ]);

                                    /** Waiting 2 seconds then calling updatLists to PUT to server */
                                    // waitSave = setTimeout(updateLists, 2000);
                                }}
                            >
                                <DeleteIcon />
                            </Button>
                        </div>
                    ))}
                    <CardActions>
                        <Button
                            type="button"
                            color="primary"
                            onClick={() => {
                                setTodos([
                                    ...todos,
                                    { name: "", checked: false }
                                ]);
                            }}
                        >
                            Add Todo <AddIcon />
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Save
                        </Button>
                    </CardActions>
                </form>
            </CardContent>
        </Card>
    );
};
