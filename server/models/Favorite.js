const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const favoriteSchema = mongoose.Schema(
  {
    userfrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    movieId: {
      type: String,
    },
    // movieTitle: {
    //   type: String,
    // },
    // moviePost: {
    //   type: String,
    // },
    // movieRunTime: {
    //   type: String,
    // },
    movieInfo: { type: Object },
  },
  { timestamps: true },
);

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = { Favorite };
