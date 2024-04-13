const mongoose = require('mongoose');
require('dotenv').config();
console.log(process.env);


// Set up mongoose connection
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_URI;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

// Export the default connection
module.exports = mongoose.connection;
