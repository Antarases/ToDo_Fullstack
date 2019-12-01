const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = mongoose.model("users");
const Chat = mongoose.model("chats");

const messageSchema = new Schema({
    text: String,
    _user: { type: Schema.Types.ObjectId, ref: "User" },
    _chat: { type: Schema.Types.ObjectId, ref: "Chat" }
}, {
    timestamps: { createdAt: "creationDate", updatedAt: "updatingDate" },
    toJSON: {   //  enable to see virtuals in output when using console.log(obj)
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
        }
    },
    toObject: {
        virtuals: true,
        transform: (doc, ret) => {
            delete ret._id;
        }
    }
});

mongoose.model("messages", messageSchema);
