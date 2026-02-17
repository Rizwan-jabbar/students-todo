import bcrypt from 'bcrypt';
import User from '../../models/userSchema/userSchema.js';

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ isSuccess: false, message: 'Name, email and password are required' });
        }

        if (password.trim().length < 8) {
            return res.status(400).send({ isSuccess: false, message: 'Password should be at least 8 characters' });
        }

        const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
        if (existingUser) {
            return res.status(400).send({ isSuccess: false, message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password.trim(), 10);

       const newUser = new User({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    profileImage: req.file ? req.file.path : null
});
        console.log('user registered successfully : ', newUser)

        await newUser.save();

        return res.status(201).send({ isSuccess: true, message: 'User registered successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ isSuccess: false, message: 'Server error' });
    }
};

export const getRegisteredUsers = async (req, res) => {
    try {

        const registeredUsers = await User.find()

        return res.status(200).json({
            message: 'users  fetched susseccfully',
            users: registeredUsers
        })

    } catch (error) {

    }
}


