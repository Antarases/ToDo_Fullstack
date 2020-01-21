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
                chats: user._chats
            }
            : null;
    };

    async getUsers(skip, limit) {
        const userList = await User
            .find(
                {},
                null,
                { skip: +skip, limit: +limit }
            )
            .exec();

        return Array.isArray(userList)
            ? userList.map(user => UserAPI.userReducer(user))
            : [];
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
