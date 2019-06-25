import React, { Fragment, useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ReceiptIcon from "@material-ui/icons/Receipt";
import Typography from "@material-ui/core/Typography";
import { ToDoListForm } from "./ToDoListForm";

// GET lists from server
const fetchLists = async () => {
    const response = await fetch("/lists");
    const body = await response.json();

    // if (body.status !== 200) throw Error(body.message);
    console.log(body);
    return body;
};

export const ToDoLists = ({ style }) => {
    const [toDoLists, setToDoLists] = useState({});
    const [activeList, setActiveList] = useState();

    useEffect(() => {
        // Call function to GET lists from server on page reload
        fetchLists().then(setToDoLists);
    }, []);

    if (!Object.keys(toDoLists).length) return null;
    return (
        <Fragment>
            <Card style={style}>
                <CardContent>
                    <Typography variant="headline" component="h2">
                        My ToDo Lists
                    </Typography>
                    <List>
                        {Object.keys(toDoLists).map(key => (
                            <ListItem
                                key={key}
                                button
                                onClick={() => setActiveList(key)}
                            >
                                <ListItemIcon>
                                    <ReceiptIcon />
                                </ListItemIcon>
                                <ListItemText primary={toDoLists[key].title} />
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>
            {toDoLists[activeList] && (
                <ToDoListForm
                    key={activeList} // use key to make React recreate component to reset internal state
                    toDoList={toDoLists[activeList]}
                    saveToDoList={(id, { todos }) => {
                        const listToUpdate = toDoLists[id];
                        setToDoLists({
                            ...toDoLists,
                            [id]: { ...listToUpdate, todos }
                        });
                    }}
                />
            )}
        </Fragment>
    );
};
