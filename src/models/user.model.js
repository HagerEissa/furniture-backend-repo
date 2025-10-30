const mongoose = require("mongoose");
const ROLES = require("../utils/roles.util");
const { hashPassword, comparePassword } = require("../utils/hashing.util");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER },
    avatar: { type: String, default: "https://res.cloudinary.com/dsso9spcd/image/upload/v1760809850/avatar/default-avatar.png" },
    loginMethod: { type: String, enum: ["local", "google", "facebook"],default: "local",},

  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.password && this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
  next();
});

userSchema.methods.matchPassword = async function (password) {
  if (!this.password) return false;
  return await comparePassword(password, this.password);
};

module.exports = mongoose.model("users", userSchema);
