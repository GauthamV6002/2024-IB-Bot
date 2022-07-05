const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Testing Function for Bot Developer(s)"),
		
	async execute(interaction, client) {
		interaction.reply({ content: "Test Completed.", ephemeral: true })
	},
};
