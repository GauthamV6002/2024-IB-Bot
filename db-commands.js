const User = require("./models/User.js");

module.exports = {
    async newUser(userData){
        try {
            const user = await User.create(userData);
            console.log(`${user} \n\n ${user.discordID} was saved 📂!`);
            return user;
        } catch (e) {
            console.log(e.message);
        }
    },

    async updateUser(userId, data){
        try {
            const user = await User.findOne({ discordID: userId });
            user = {...user, data};
            user.save();
            console.log(`${user} \n\n ${user.discordID} was updated 🔃!`);
        } catch (e) {
            console.log(e.message);
        }
    },

    async getUsers(args={}){
        try {
            const users = await User.find(args);
            return users;
        } catch (e) {
            console.log(e.message);
        }
    },

    async getUser(userId){
        try {
            const user = await User.findOne({ discordID: userId });
            return user;
        } catch (e) {
            console.log(e.message);
        }
    },

    async getOrNewUser(userId, tag, userData = {}) {
        try {
			const user = await User.findOne({ discordID: userId });
			if(!user){
                const user = await User.create({...userData, discordID: userId, discordTag: tag});
				console.log(`${user} \n\n ${user.discordID} was saved 📂!`);
				return user;
            }
            return user;
		} catch (e) {
			console.log(e.message);
		}
    },
}
