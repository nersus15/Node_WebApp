// import packgaes and moduls
const bcrypt = require('bcryptjs');
const userModel = require('../../models/user');
const { Users } = require('./mergeResolver');

// make action graphQl and export as modul
module.exports = {
    users: async (args, req) => {
        if (!req.isAuth) {
            throw new Error("You don't have access ");
        }
        try {
            const MyUsers = await userModel.find({ _id: req.userId });
            return MyUsers.map(MyUser => {
                return Users(MyUser)
            })
        } catch (err) {
            throw err
        }
    },
};