const mongoose = require("mongoose");

const User = mongoose.model("users");

class UserAPI {
    static userReducer(user) {
        return user
            ? {
                id: user.id || user._id,
                googleId: user.googleId,
                userFullName: user.userFullName,
                email: user.email,
                avatar: user.avatar,
                isAdmin: user.isAdmin,
                chats: user._chats,
                creationDate: user.creationDate,
                updatingDate: user.updatingDate
            }
            : null;
    };

    async getUsers(cursor, limit) {
        limit = +limit;

        let users;
        if (limit > 0) {
            if (cursor) {
                users = await User
                    .find(
                        { creationDate: { $gt: cursor } },
                        null,
                        {
                            sort: { creationDate: "asc"},
                            limit
                        }
                    )
                    .exec();
            } else {
                users = await User
                    .find(
                        {},
                        null,
                        {
                            sort: { creationDate: "asc"},
                            limit
                        }
                    )
                    .exec();
            }

            users = Array.isArray(users)
                ? users.map(user => UserAPI.userReducer(user))
                : [];
        } else {
            users = []
        }

        return {
            data: users,
            paginationMetadata: {
                nextCursor: users.length
                    ? JSON.stringify(Number(users[users.length - 1].creationDate))
                    : null
            }
        };
    }

    getUsersByIds(userIds) {
        return User.find({ _id: { $in: userIds} });
    }

    async getUserById(userId) {
        const user = await User.findById(userId);

        return UserAPI.userReducer(user);
    }

    getTotalUsersAmount() {
        return User.countDocuments();
    }
}

module.exports = UserAPI;
