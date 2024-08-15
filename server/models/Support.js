import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    sender: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
});

const conversationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [messageSchema],
    status: {type : String},
    sessionId: {type : String},
    isAdminOnline: { type: Boolean, default: false },
    adminName: {type : String}
},{timestamp : true});

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation ;