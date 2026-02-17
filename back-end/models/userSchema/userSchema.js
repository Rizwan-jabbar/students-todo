import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name : {
      type : String,
      required : true,
      lowercase : true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true, // extra safety
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage : {
      type : String,
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
