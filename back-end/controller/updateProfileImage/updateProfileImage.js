import User from "../../models/userSchema/userSchema.js";

import fs from 'fs';
import path from 'path';


const updateProfileImage = async (req , res ) => {
    try {


        const userId = req.user.id;

        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({isSuccsess : false , message : 'user not found'})
        };


        if(!req.file){
            return res.status(400).json({
                isSuccess : false,
                message : 'no file uploaded'
            })
        }

        if(user.profileImage){
            const oldImagePath = path.join('uploads' , user.profileImage);

            if(fs.existsSync(oldImagePath)){
                fs.unlinkSync(oldImagePath)
            }
        }


        user.profileImage = req.file.filename;

        await user.save();


        return res.status(200).json({
            isSucccess : true,
            message : 'profile image uplaoded successfully',
            profileImage : user.profileImage,
        })
        
    } catch (error) {
        
        return res.status(500).json({
            isSuccsess : false,
            message : 'server error'
        })
    }
}


export default updateProfileImage;