const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    image: String,
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    _participants: [{ type: Schema.Types.ObjectId, ref: "users" }]
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

mongoose.model("events", eventSchema);
