const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    merchantId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Merchant",
    },

    role: {
      type: String,
      enum: ["merchant", "admin"],
      default: "merchant",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("User", userSchema);