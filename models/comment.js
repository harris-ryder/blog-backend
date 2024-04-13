const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  text: { type: String, required: true, maxLength: 100 },  
  date: { type: String, required: true, maxLength: 100 },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});


module.exports = mongoose.model("Comment", CommentSchema);
