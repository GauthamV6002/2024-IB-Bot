const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Testing Function for Bot Developer(s)"),
		
	async execute(interaction, client) {
		await interaction.reply("Test Completed.");
	},
};