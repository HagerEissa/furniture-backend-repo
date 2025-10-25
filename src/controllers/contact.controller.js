const Contact = require("../models/contact.model");

exports.sendMessage = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res
        .status(400)
        .json({ error: "Name, Email, and Message are required." });
    }

    try {
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(200).json({ message: "Message sent successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getMessage = async (req, res) => {
    try {
        const messages = await Contact.find().sort({ createdAt: -1 });
        res.status(200).json({ messages });
    } catch (error) {
        console.log("Error Finding Messages");
        res.status(400).json({ message: error.message });
    }
};


exports.deleteMessage = async (req, res) => {
    const { messageId } = req.params;

    try {
        const deletedMessage = await Contact.findByIdAndDelete(messageId);

        if (!deletedMessage) {
        return res.status(404).json({ message: "Message not found." });
        }

        res.status(200).json({ message: "Message deleted successfully." });
    } catch (error) {
        console.error("❌ Error deleting message:", error);
        res.status(500).json({ error: error.message });
    }
};
