const mongoose = require('mongoose');
const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true, // Ensure ID is unique
    },
    email: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate emails
      lowercase: true, // Ensure email is stored in lowercase
      match: [
        /^\S+@\S+\.\S+$/,
        'Please provide a valid email address',
      ], // Basic email validation
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the creation date
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically set the update date
    },
    permissions: {
      type: [String],
      default: [], // Default to empty array
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

// Middleware to update updatedAt field on save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// Export the model
module.exports = mongoose.model('User', userSchema);
