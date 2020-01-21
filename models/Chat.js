const mongoose = require("mongoose");
const { Schema } = mongoose;

const chatSchema = new Schema({
    name: String,
    _members: [{ type: Schema.Types.ObjectId, ref: "users" }],
    lastMessage: { type: String, default: null }
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

mongoose.model("chats", chatSchema);
