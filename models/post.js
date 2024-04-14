const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 1000 },
  text: { type: String, required: true, maxLength: 10000 },  
  date: { type: String, required: true, maxLength: 100 },
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // Assuming Post is another model
  public: { type: Boolean, required: true, default: false },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  tags: [{type: String, require: true}],
  file: { type: Buffer, contentType: String },
  imageOwner: {type:String, required: false, maxLength: 500},
},{
  toJSON: { virtuals: true }, // Ensure virtuals are included in toJSON
  toObject: { virtuals: true } // Ensure virtuals are included in toObject
});

// Virtual for user's URL
PostSchema.virtual("url").get(function () {
  return `posts/${this._id}`;
});

PostSchema.virtual("imageUrl").get(function(){

  if (this.file) {
    return "data:image/png;base64," + this.file.toString("base64");
  }

  const rndInt = Math.floor(Math.random() * 6) + 1

  return `https://picsum.photos/id/${rndInt}/800/300`;
});

PostSchema.pre('save', function(next) {
  if (!this.title || !this.text) {
    return next(new Error('Title and text are required.'));
  }
  // Add more validation logic as needed
  next();
});



module.exports = mongoose.model("Post", PostSchema);
