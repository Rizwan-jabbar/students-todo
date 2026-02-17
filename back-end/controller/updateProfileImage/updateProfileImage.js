// backend/controllers/updateProfileImage.js
import User from "../../models/userSchema/userSchema.js";
import { v2 as cloudinary } from "cloudinary";

const updateProfileImage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ isSuccess: false, message: "User not found" });

    if (!req.file) return res.status(400).json({ isSuccess: false, message: "No file uploaded" });

    // Delete old image from Cloudinary
    if (user.profileImage) {
      await cloudinary.uploader.destroy(user.profileImage); // public_id
    }

    // Upload new image
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "students-todo",
    });

    user.profileImage = result.public_id;
    await user.save();

    // Return secure_url for frontend
    return res.status(200).json({
      isSuccess: true,
      message: "Profile image uploaded successfully",
      profileImage: result.secure_url,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ isSuccess: false, message: "Server error" });
  }
};

export default updateProfileImage;
