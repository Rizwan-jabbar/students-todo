import User from "../../models/userSchema/userSchema.js";
import fs from "fs";
import path from "path";

const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        isSuccess: false,
        message: "User not found",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        isSuccess: false,
        message: "No file uploaded",
      });
    }

    // Delete old image if exists
    if (user.profileImage) {
      const oldImagePath = path.join("uploads", path.basename(user.profileImage));
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Save new image filename in DB
    user.profileImage = req.file.filename;
    await user.save();

    // Build full URL to send to frontend
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(200).json({
      isSuccess: true,
      message: "Profile image uploaded successfully",
      profileImage: imageUrl,
    });
  } catch (error) {
    console.error("Update profile image error:", error);
    return res.status(500).json({
      isSuccess: false,
      message: "Server error",
    });
  }
};

export default updateProfileImage;
