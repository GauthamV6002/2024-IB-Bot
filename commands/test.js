const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Testing Function for Bot Developer(s)"),
		
	async execute(interaction, client) {
		
		const embed = new MessageEmbed()
			.setColor('GOLD')
			.setTitle('TITLE')
			.setDescription('Description!')
			.addFields(
				{ name: 'Armout', value: '+3HP'},
				{ name: 'cannon', value: '+2Attack'},
			);		
		
		const row = new MessageActionRow().addComponents(
			new MessageButton()
				.setCustomId("primary")
				.setLabel("Primary")
				.setStyle("SUCCESS")
		);

		const collector = interaction.channel.createMessageComponentCollector({
			filter: (i) => i.customId === "primary",
			time: 15000,
		});

		collector.on("collect", async (i) => {
			if (i.customId === "primary"){
				i.update({ components: [row] })
			}
		});

		await interaction.reply({
			content: "Pong!",
			embeds: [embed],
			components: [row],
		});

		// interaction.reply({ content: "Test Completed.", ephemeral: true })
	},
};
