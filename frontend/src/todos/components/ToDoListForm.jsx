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

export const ToDoListForm = ({ toDoList, saveToDoList }) => {
    const classes = useStyles();
    const [todos, setTodos] = useState(toDoList.todos);

    const handleSubmit = async event => {
        event.preventDefault();
        saveToDoList(toDoList.id, { todos });
        // PUT new todos to list on server given by id
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

    return (
        <Card className={classes.card}>
            <CardContent>
                <Typography variant="headline" component="h2">
                    {toDoList.title}
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
                                    setTodos([
                                        // immutable update
                                        ...todos.slice(0, index),
                                        {
                                            name: event.target.value,
                                            checked: todo.checked
                                        },
                                        ...todos.slice(index + 1)
                                    ]);
                                }}
                                // style={{
                                //     textDecoration: todo.checked
                                //         ? "line-through"
                                //         : "none"
                                // }}
                                className={classes.textField}
                            />
                            <Button
                                size="small"
                                color="secondary"
                                className={classes.standardSpace}
                                onClick={() => {
                                    setTodos([
                                        // immutable delete
                                        ...todos.slice(0, index),
                                        ...todos.slice(index + 1)
                                    ]);
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
