import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  // userId: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "User",
  //   required: true,
  // },
  longurl: {
    type: String,
    required: true,
    unique: true,
  },
  shorturl: {
    type: String,
    required: true,
  },
  numOfClicks: {
    type: Number,
    default: 0,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
});

const Url = mongoose.model("url", urlSchema);

export default Url;
