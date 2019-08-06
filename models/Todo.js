const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = mongoose.model("users");

const todoSchema = new Schema({
    _user: { type: Schema.Types.ObjectId, ref: "User" },
    text: String,
    image: String,
    isCompleted: { type: Boolean, default: false}
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

mongoose.model("todos", todoSchema);
