const { AuthenticationError } = require("apollo-server-express");

module.exports.assertAuthenticated = (currentUser) => {
    if (!(currentUser && Object.keys(currentUser).length)) {
        throw new AuthenticationError("You must log in!");
    }
};

module.exports.assertIsAdmin = (currentUser) => {
    if (!currentUser.isAdmin) {
        throw new AuthenticationError("You need to be an admin.");
    }
};

module.exports.assertChatMember = async (currentUser, chatId, chatAPI) => {
    const chatMemberIds = await chatAPI.getChatMembersByChatId(chatId);

    if (!chatMemberIds.includes(currentUser.id)) {
        throw new AuthenticationError("You need to be chat member.");
    }
};

module.exports.assertIsTodoAuthorOrAdmin = async (currentUser, todoId, todoAPI) => {
    const todoAuthorId = await todoAPI.getTodoAuthorId(todoId);

    if (
        (String(todoAuthorId) !== String(currentUser.id))
        && (!currentUser || !currentUser.isAdmin)
    ) {
        throw new AuthenticationError("You need to be todo author or Admin.");
    }
};
