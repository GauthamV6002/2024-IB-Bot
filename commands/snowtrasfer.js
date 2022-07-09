const { SlashCommandBuilder } = require('@discordjs/builders');
const { getOrNewUser } = require("../db-commands.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snowtransfer')
        .setDescription('Transfer a certain amount of snowpoints to other players!')
        .addUserOption((option) => option
			.setName("receiver")
			.setDescription("Who are you throwing at?")
			.setRequired(true)
		)
        .addIntegerOption((option) => option
			.setName("amount")
			.setDescription("How much are you transferring?")
			.setRequired(true)
		),
    async execute(interaction, client) {
        const user = await getOrNewUser(
			interaction.user.id,
			interaction.user.tag
		);
		const receiver = await getOrNewUser(
			interaction.options.getUser("receiver").id,
			interaction.options.getUser("receiver").tag
		);
        const amount = interaction.options.getInteger("amount");

        if(user.snowPoints - amount < 0){
            interaction.reply("❌ You don't have enough snowpoints!");
            return;
        }

        user.snowPoints -= amount;
        receiver.snowPoints += amount;
        user.save();
        receiver.save();

        interaction.reply("✅ Transfer Successful!");
    },
}