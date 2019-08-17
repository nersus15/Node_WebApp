// import packgaes and moduls
const bcrypt = require('bcryptjs');
const userModel = require('../../models/user');


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
    }
}