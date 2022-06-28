const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snowstats')
        .setDescription('Get your stats!'),
    async execute(interaction, client) {
        const collected = 10;
        const thrown = 15;
        const KOs = 2;
        const accuracy = 0.75 * 100; //API fetch would be a decimal

        const embed = new MessageEmbed()
			.setColor("#d1e5e8")
			.setTitle("Snowball Stats")
			.setDescription(
				`Information about total thrown & collected snowballs, KOs, and accuracy for ${interaction.user}`
			)
            .setThumbnail("https://freshinbox.com/images/ext/holidays2015/snowball-round.png")
			.addFields(
				{ name: "Total Collected Snowballs", value: collected.toString() },
				{ name: "Total Thrown Snowballs", value: thrown.toString() },
				{ name: "Total KOs", value: KOs.toString() },
				{ name: "Accuracy", value: accuracy.toString() }
			);

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
}