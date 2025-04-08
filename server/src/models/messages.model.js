import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false
    },

    messageType: {
        type: String,
        enum: ["text", "file"],
        required: true
    },

    content: {
        type: String,
        required: function () {
            return this.messageType === "text";
        }
    },

    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === "file";
        }
    },

    timestamp: {
        type: Date,
        
    }

});

export const Message = mongoose.model("Message", messageSchema);