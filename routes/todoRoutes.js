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
            try {
                const { id: userId, isAdmin } = req.user;
                const { page } = req.query;

                const {sortField, sortOrder} = helpers.setDefaultValuesForIncorrectSortParamOrOrder(req.query.sortField, req.query.sortOrder);

                if ((sortField === "userFullName") && !isAdmin) {
                    res.status(403).send({ code: 403, text: `You are not allowed to sort by "userFullName"` });
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
;
                    res.send({todos, totalTodosAmount, code: 200});
                }
            } catch (error) {
                console.log(error);
                res.status(422).send({ code: 422, text: "An error occured during getting todos", error: error.message });
            }
        }
    );

};

