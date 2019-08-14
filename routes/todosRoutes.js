const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const helpers = require("../helpers/functions");
const TODOS_CONSTANTS = require("../constants/todos");

const Todo = mongoose.model("todos");
const User = mongoose.model("users");

module.exports = (app) => {
    app.get(
        "/todos",
        requireLogin,
        async (req, res) => {
            const { page } = req.query;
            const {sortField, sortOrder} = helpers.setDefaultValuesForIncorrectSortParamOrOrder(req.query.sortField, req.query.sortOrder);

            if ((sortField === "userFullName") && !req.user.isAdmin) {
                res.status(403).send({ code: 403, text: `You are not allowed to sort by "userFullName"` });
            }

            const totalTodosAmount = await Todo
                .find(req.user.isAdmin ? {} : { _user: req.user.id })
                .countDocuments();

            let todos = await Todo.aggregate([
                { $match: req.user.isAdmin ? {} : { _user: mongoose.Types.ObjectId(req.user.id) } },
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
                        "creationDate": "asc"
                    }
            )
            .project({ author: 0 })
            .skip((page - 1) * TODOS_CONSTANTS.TODOS_PER_PAGE)
            .limit(TODOS_CONSTANTS.TODOS_PER_PAGE)
            .exec();

            res.send({todos, totalTodosAmount});
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

                    res.send({...updatedTodo});
                });
            } catch (error) {
                res.status(422).send(error);
            }
        }
    );
};
