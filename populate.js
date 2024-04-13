#! /usr/bin/env node

console.log(
  'This script populates your database. Specified database as argument - e.g.: node populatedb ""mongodb+srv://harrisryder:SZvKh0NskOFEvDoW@cluster0.nt7psh5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0""'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
const mongoose = require("mongoose");


const User = require("./models/user");
const Post = require("./models/post");
const Comment = require("./models/comment");
const bcrypt = require('bcryptjs');




const users = [];
const posts = [];
const comments = [];

mongoose.set("strictQuery", false);
const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
 // await createUsers();
 // await createComments();
  await createPosts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function userCreate(firstName, lastName, username, password) {

const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    firstName: firstName,
    lastName: lastName,
    username: username,
    hash: hashedPassword,
  });
  await user.save();
  users.push(user);
  console.log(`Added user: ${username}`);
}

async function commentCreate(text, date, user) {
  const comment = new Comment({
    text: text,
    date: date,
    user: user,
  });

  await comment.save();
  comments.push(comment);
  console.log(`Added comment: ${text}, created at ... ${date}`);
}

async function postCreate(title, text, date, user, public, comments, tags) {
  const post = new Post({
    title: title,
    text: text,
    date: date,
    user: user,
    public: public,
    comments: comments,
    tags: tags,
  });

  await post.save();

  posts.push(post);

  console.log(`Added post: ${title}`);
}


async function createUsers() {
  console.log("Adding Users");
  await Promise.all([
    userCreate("Gareth", "John", "Garethnator","letmein"),
    userCreate("Tim", "Phuket", "Timmy", "letmein"),
    userCreate("Casey", "Taylor", "Taylornator", "letmein"),
  ]);
}

async function createComments() {
  console.log("Adding Comments");
  await Promise.all([
    commentCreate(
        "Good content really appreciated this",
      "2024-03-22",
      users[0] // Assuming users[0] is a valid user object
    ),
    commentCreate(
        "I've got a thought or two on this",
        "2024-03-22",
      users[1] // Assuming users[1] is a valid user object
    ),
    commentCreate(
        "Im lost, help",
        "2024-03-22",
      users[2] // Assuming users[2] is a valid user object
    ),
    commentCreate(
        "free engagement",
        "2024-03-22",
      users[0] // Assuming users[2] is a valid user object
    ),
    commentCreate(
        "2+2=1",
        "2024-03-22",
      users[2] // Assuming users[2] is a valid user object
    ),
  ]);
}

async function createPosts() {
    console.log("Adding Posts");
    await Promise.all([
      postCreate("Exploring the Intersection of AI and Artistic Creativity", "In an era where technology and art converge, AI emerges as a pivotal force in redefining creativity. This exploration delves into how artificial intelligence is not just mimicking but also enhancing the artistic process, pushing the boundaries of what's possible in the realm of art and technology.", "2024-03-22", users[0], true, comments[0], ["art", "tech"]),
      postCreate("The Essence of Art in Daily Life", "Art is not just a form of expression but a necessity in enhancing the beauty of our daily existence. This piece reflects on how art influences and elevates our everyday experiences, from the mundane to the extraordinary, showcasing its indispensable role in life.", "2024-03-23", users[1], true, comments[2], ["art"]),
      postCreate("The Art of Travel: Beyond Borders", "Traveling is more than just moving from one place to another; it's an art that opens our minds and enriches our souls. This narrative explores the profound impact of travel on our perception of the world, emphasizing the importance of cultural exchange and personal growth.", "2024-03-24", users[2], true, comments[1], ["travel", "food"]),
      postCreate("Innovations in Sanitary Technology: The Japanese Toilet Experience", "The Japanese toilet symbolizes the pinnacle of sanitary technology, blending comfort with innovation. This article delves into how these technological marvels revolutionize our bathroom experiences, offering insights into the future of personal hygiene.", "2024-03-25", users[0], false, comments[0], ["tech"]),
      postCreate("Redefining Urban Spaces Through Green Architecture", "As cities grow denser, the integration of green architecture becomes crucial in creating sustainable urban environments. This discussion explores innovative approaches to urban design that prioritize green spaces and eco-friendly structures, aiming to enhance the quality of life for city dwellers while addressing environmental concerns.", "2024-03-26", users[1], true, comments[2], ["architecture", "sustainability"]),
      postCreate("The Digital Renaissance: NFTs and the Future of Art Ownership", "The advent of NFTs (Non-Fungible Tokens) marks a significant shift in how art is owned and valued in the digital age. This analysis delves into the implications of NFTs for artists and collectors, exploring how this technology is creating new opportunities for authentication, ownership, and the monetization of digital art.", "2024-03-27", users[2], true, comments[1], ["art", "technology"]),
    ]);
}
