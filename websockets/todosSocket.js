const mongoose = require("mongoose");
const Todo = mongoose.model("todos");
const User = mongoose.model("users");
const helpers = require("../helpers/functions");
const TODOS_CONSTANTS = require("../constants/todos");

module.exports = (httpServer) => {
    const TodoSocket = require("socket.io")(httpServer, { path: "/todos" });

    TodoSocket.on("connect", async function(socket){
        const { userId, isAdmin, initialPage: page, sortField, sortOrder } = socket.handshake.query;
        await emitGetTodos(socket, userId, (isAdmin === "true"), page, sortField, sortOrder);

        socket.on("get_todos", (data) => {
            const { userId, isAdmin } = socket.handshake.query;
            const { page, sortField, sortOrder, nextPage } = data;

            emitGetTodos(socket, userId, (isAdmin === "true"), page, sortField, sortOrder, nextPage);
        });

        socket.on("add_todo", async (todoData) => {
            const { text, image } = todoData;

            const todo = new Todo({
                _user: socket.handshake.query.userId,
                text,
                image
            });

            try {
                let savedTodo = await todo.save();
                savedTodo = savedTodo.toObject();
                savedTodo.authorFullName = socket.handshake.query.userFullName;
                delete savedTodo._user;

                TodoSocket.emit("add_todo", { todo: savedTodo, code: 200 });
            } catch(error) {
                socket.emit("add_todo", {code: 422, text: "An error occured during adding todo"});
            }
        });

        socket.on("edit_todo", async (todoData) => {
            const { id, text, image, isCompleted } = todoData;

            try {
                await Todo.findByIdAndUpdate(
                    id,
                    {
                        text,
                        image,
                        isCompleted
                    },
                    {
                        new: true,   //return the modified document rather than the original
                    }
                )
                    .populate({ path: "_user", select: "userFullName", model: User })
                    .exec((err, updatedTodo) => {
                        updatedTodo = updatedTodo.toObject();
                        updatedTodo.authorFullName = updatedTodo._user.userFullName;
                        delete updatedTodo._user;

                        TodoSocket.emit("edit_todo", {todo: {...updatedTodo}, code: 200});
                    });
            } catch (error) {
                socket.emit("edit_todo", {code: 422, text: "An error occured during editing todo"});
            }
        });
    });
};

async function emitGetTodos(socket, userId, isAdmin, page, uncheckedSortField, uncheckedSortOrder, nextPage) {
    const {sortField, sortOrder} = helpers.setDefaultValuesForIncorrectSortParamOrOrder(uncheckedSortField, uncheckedSortOrder);

    if (!isAdmin && (sortField === "userFullName")) {
        socket.emit("get_todos", { code: 403, text: `You are not allowed to sort by "userFullName"` });
    } else {
        const totalTodosAmount = await Todo
            .find(isAdmin ? {} : { _user: userId })
            .countDocuments();

        let todos = await Todo.aggregate([
            { $match: isAdmin ? {} : { _user: mongoose.Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "users",
                    localField: "_user",
                    foreignField: "_id",
                    as: "author"
                }
            },
            { $unwind: "$author" },
            { $addFields: { id: "$_id", authorFullName: "$author.userFullName" } },
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
            .project({ author: 0 })
            .skip((page - 1) * TODOS_CONSTANTS.TODOS_PER_PAGE)
            .limit(TODOS_CONSTANTS.TODOS_PER_PAGE)
            .exec();

        socket.emit("get_todos", {todos, totalTodosAmount, nextPage, code: 200});
    }
}
