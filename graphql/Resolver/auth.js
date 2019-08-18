// import packgaes and moduls
const bcrypt = require('bcryptjs');
const userModel = require('../../models/user');
const jwt = require('jsonwebtoken');

// make action graphQl and export as modul
module.exports = {
    users: async () => {
        try {
            const MyUsers = await userModel.find();
            return MyUsers.map(MyUser => {
                return {
                    ...MyUser._doc,
                    _id: MyUser.id,
                    createdEvents: eventsData.bind(this, MyUser._doc.createdEvent)
                }
            })
        } catch (err) {
            throw err
        }
    },
    createUSer: async (args) => {
        try {
            const User = await userModel.findOne({ email: args.inputNewUSer.email })
            if (User) {
                throw new Error("this email already use");
            }
            const hashedPassword = await bcrypt.hash(args.inputNewUSer.password, 12)
            const UserModel = new userModel({
                username: args.inputNewUSer.username,
                email: args.inputNewUSer.email,
                password: hashedPassword
            });
            const result = await UserModel.save();
            return { ...result._doc, password: "secret", _id: result.id }
        } catch (err) {
            throw err
        }
    },
    login: async ({ email, password }) => {
        const userData = await userModel.findOne({ email: email });
        if (!userData) {
            throw new Error("Email Doesn't Register");
        }
        const isEqual = await bcrypt.compare(password, userData.password);
        if (!isEqual) {
            throw new Error("Password is incorrect!");
        }
        const token = jwt.sign(
            { userId: userData.id, username: userData.username, email: userData.email },
            '102408',
            { expiresIn: '1h' }
        );
        return {
            userId: userData.id, token: token, tokenExp: 1
        }
    }
};