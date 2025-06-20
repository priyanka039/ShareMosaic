const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true, maxlength: 1000 },
  author: { type: String, required: true },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', noteSchema);

// const mongoose = require('mongoose');

// const noteSchema = new mongoose.Schema({
//     content: {
//         type: String,
//         required: true
//     },
//     author: {
//         type: String,
//         required: true
//     },
//     likes: {
//         type: Number,
//         default: 0
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// });

// module.exports = mongoose.model('Note', noteSchema);