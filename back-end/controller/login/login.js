import User from "../../models/userSchema/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SECRET_KEY from "../../data/secret_key.js";

const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    // ✅ Trim input
    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      return res.status(400).json({
        isSuccess: false,
        message: "Email and password are required",
      });
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });
    }


    // ✅ Compare password
    const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
    console.log("PASSWORD MATCH:", isPasswordValid);

    if (!isPasswordValid) {
      return res.status(401).json({
        isSuccess: false,
        message: "Invalid password",
      });
    }

    console.log('user found : ' , user)

    // ✅ Generate token
    const token = jwt.sign(
      { name: user.name, id: user._id, email: user.email },
      SECRET_KEY,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      isSuccess: true,
      message: "Login successful",
      user: {
        name: user.name,
        id: user._id,
        email: user.email,
        profileImage : user.profileImage || null
      },
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Server error",
    });
  }
};

export default login;
