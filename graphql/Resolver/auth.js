// import packgaes and moduls
const bcrypt = require('bcryptjs');
const userModel = require('../../models/user');
const jwt = require('jsonwebtoken');
const { Users } = require('./mergeResolver');

// make action graphQl and export as modul
module.exports = {
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