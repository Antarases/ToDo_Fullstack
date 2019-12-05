const mongoose = require("mongoose");
const Todo = mongoose.model("todos");
const User = mongoose.model("users");
const helpers = require("../helpers/functions");

module.exports = (httpServer) => {
    const TodoSocket = require("socket.io")(httpServer, { path: "/todos_ws" });

    TodoSocket.of("/todos_ws").on("connect", async function(socket){
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

                TodoSocket.of("todos_ws").emit("add_todo", { todo: savedTodo, code: 200 });
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

                        TodoSocket.of("todos_ws").emit("edit_todo", {todo: {...updatedTodo}, code: 200});
                    });
            } catch (error) {
                socket.emit("edit_todo", {code: 422, text: "An error occured during editing todo"});
            }
        });
    });
};
