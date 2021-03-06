var React = require('react');
var uuid = require('node-uuid');
var moment = require('moment');

var TodoList = require('TodoList');
var AddTodoItem = require('AddTodoItem');
var TodoSearch = require('TodoSearch');
var TodoAPI = require('../api/TodoAPI');

class TodoApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showCompleted: false,
            searchText: '',
            todoItems: TodoAPI.getTodoItems()
        }
    }

    componentDidUpdate() {
        TodoAPI.setTodoItems(this.state.todoItems);
    }

    handleToggleItem = (id) => {

        var updatedTodoItems = this.state.todoItems.map((todoItem) => {
            //toggle the completed status of the matching id
            if (todoItem.id === id) {
                todoItem.completed = !todoItem.completed;
                todoItem.completeDate = todoItem.completed ? moment().unix() : undefined;
            }
            return todoItem;
        });

        //updatedTodoItems holds the original todoItems with the matching items completed status changed
        this.setState({
            todoItems: updatedTodoItems
        });

    }

    handleAddTodoItem = (text) => {
        //use the spread operator to set the state to the old state and then add a new objecct attached at the end
        //
        this.setState({
            todoItems: [
                ...this.state.todoItems, {
                    id: uuid(),
                    text: text,
                    completed: false,
                    createDate: moment().unix(),
                    completeDate: undefined
                }
            ]
        })
    }


    handleSearchItem = (showCompleted, searchText) => {
        this.setState({
            showCompleted: showCompleted,
            searchText: searchText.toLowerCase()
        });
    }

    render() {
        var {todoItems, showCompleted, searchText}= this.state;
        var filteredTodoItems = TodoAPI.getFilteredTodoItems(todoItems, showCompleted, searchText);
        return (
            <div>
                <h1 className="text-center page-title">Todo App</h1>
                <div className="row">
                    <div className="column small-centered small-11 medium-6 large-6">
                        <div className="container ">
                            <TodoSearch onSearchItem={this.handleSearchItem}/>
                            <TodoList todoItems={filteredTodoItems} onToggleItem={this.handleToggleItem}/>
                            <AddTodoItem onAddTodoItem={this.handleAddTodoItem}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

module.exports = TodoApp;