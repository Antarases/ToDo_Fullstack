const mongoose = require("mongoose");
const helpers = require("../helpers/functions");
const TODOS_CONSTANTS = require("../constants/todos");

const Todo = mongoose.model("todos");
const User = mongoose.model("users");

const UserAPI = require("./UserAPI");

class TodoAPI {
    static todoReducer(todo) {
        return todo
            ? {
                id: todo.id,
                author: UserAPI.userReducer(todo.author),
                text: todo.text,
                image: todo.image,
                isCompleted: todo.isCompleted,
                creationDate: todo.creationDate,
                updatingDate: todo.updatingDate
            }
            : null;
    };

    async getTodos(page, reqSortField, reqSortOrder, userId, isAdmin) {
        const {sortField, sortOrder} = helpers.setDefaultValuesForIncorrectSortParamOrOrder(reqSortField, reqSortOrder);

        let todos = await Todo.aggregate([
            { $match: isAdmin ? {} : {_user: mongoose.Types.ObjectId(userId)} },
            {
                $lookup: {
                    from: "users",
                    localField: "_user",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            { $addFields: { id: "$_id" } },
            { $project: { _id: 0, _user: 0 } }
        ])
            .sort(
                (sortField === "userFullName")
                    ? {
                        "author.userFullName": sortOrder,
                        "creationDate": "asc"
                    }
                    : {
                        [sortField]: sortOrder,
                        "creationDate": (sortField === "creationDate") ? sortOrder : "asc"
                    }
            )
            .skip((page - 1) * TODOS_CONSTANTS.TODOS_PER_PAGE)
            .limit(TODOS_CONSTANTS.TODOS_PER_PAGE)
            .exec();

        return Array.isArray(todos)
            ? todos.map(todo => TodoAPI.todoReducer(todo))
            : [];
    }

    async getTotalTodosAmount(userId, isAdmin) {
        return await Todo
            .find(isAdmin ? {} : {_user: userId})
            .countDocuments();
    }

    async addTodo(text, image, author) {
        const todo = new Todo({
            _user: author.id,
            text,
            image
        });

        let savedTodo = await todo.save();
        savedTodo = savedTodo.toObject();
        savedTodo.author = author;

        return TodoAPI.todoReducer(savedTodo);
    }

    async editTodo(todoId, text, image, isCompleted) {
        let editedTodo = await Todo.findByIdAndUpdate(
            todoId,
            {
                text,
                image,
                isCompleted
            },
            {
                new: true,   //return the modified document rather than the original
            }
        )
        .populate({ path: "_user", model: User })
        .exec();

        if (editedTodo) {
            editedTodo = editedTodo.toObject();
            editedTodo.author = editedTodo._user;
            delete editedTodo._user;

            return TodoAPI.todoReducer(editedTodo);
        } else {
            return editedTodo;
        }
    }

    async getTodoAuthorId(todoId) {
        const todoAuthorId = await Todo.findById(todoId, "_user");
        return todoAuthorId._user;
    }
}

module.exports = TodoAPI;

