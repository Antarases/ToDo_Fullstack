const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    googleId: String,
    userFullName: String,
    email: String,
    avatar: String,
    isAdmin: { type: Boolean, default: false },
    _chats: [{ type: Schema.Types.ObjectId, ref: "chats" }]
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

mongoose.model("users", userSchema);
