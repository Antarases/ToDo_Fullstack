const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const helpers = require("../helpers/functions");
const TODOS_CONSTANTS = require("../constants/todos");

const Todo = mongoose.model("todos");

module.exports = (app) => {
    app.get(
        "/todos",
        requireLogin,
        async (req, res) => {
            const { page } = req.query;
            const {sortField, sortOrder} = helpers.setDefaultValuesForIncorrectSortParamOrOrder(req.query.sortField, req.query.sortOrder);

            const totalTodosAmount = await Todo
                .find(req.user.isAdmin ? {} : { _user: req.user.id })
                .countDocuments();

            if (sortField !== "userFullName") {

                let todos = await Todo
                    .find(req.user.isAdmin ? {} : { _user: req.user.id }, { _user: 0 })
                    .sort({
                        [sortField]: sortOrder
                    })
                    .skip((page - 1) * TODOS_CONSTANTS.TODOS_PER_PAGE)
                    .limit(TODOS_CONSTANTS.TODOS_PER_PAGE);

                res.send({todos, totalTodosAmount});
            } else {
                if (!req.user.isAdmin) {
                    res.status(403).send({ code: 403, text: `You are not allowed to sort by "userFullName"` });
                }

                let todos = await Todo.aggregate([
                    {
                        $lookup: {
                            from: "users",
                            localField: "_user",
                            foreignField: "_id",
                            as: "users"
                        }
                    },
                    { $unwind: "$users" },
                    { $addFields: { id: "$_id" } },
                    { $project: { _id: 0, _user: 0 } }
                ])
                .sort({
                    "users.userFullName": sortOrder,
                    "creationDate": "asc"
                })
                .project({ users: 0 })
                .skip((page - 1) * TODOS_CONSTANTS.TODOS_PER_PAGE)
                .limit(TODOS_CONSTANTS.TODOS_PER_PAGE)
                .exec();

                res.send({todos, totalTodosAmount});
            }
        }
    );

    app.post(
        "/todos/add_todo",
        requireLogin,
        async (req, res) => {
            const { text, image } = req.body;

            const todo = new Todo({
                _user: req.user.id,
                text,
                image
            });

            try {
                const savedTodo = await todo.save();

                res.send(savedTodo);
            } catch(error) {
                res.status(422).send(error);
            }
        }
    );

    app.put(
        "/todos/edit_todo/:id",
        requireLogin,
        async (req, res) => {
            const { id } = req.params;
            const { text, image, isCompleted } = req.body;


            try {
                const updatedTodo = await Todo.findByIdAndUpdate(
                    id,
                    {
                        text,
                        image,
                        isCompleted
                    },
                    {
                        new: true,   //return the modified document rather than the original
                        select: { _user: 0 }
                    }
                );

                res.send(updatedTodo);
            } catch (error) {
                res.status(422).send(error);
            }
        }
    );
};
