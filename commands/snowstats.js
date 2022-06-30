const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js");
const { getOrNewUser } = require("../db-commands.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snowstats')
        .setDescription('Get your stats!'),
    async execute(interaction, client) {
        const user = await getOrNewUser(interaction.user.id, interaction.user.tag);
        const accuracy = (user.snowHits / user.snowThrown * 100).toFixed(2)
        const embed = new MessageEmbed()
			.setColor("#d1e5e8")
			.setTitle("Snowball Stats")
			.setDescription(
				`Information about total thrown & collected snowballs, KOs, and accuracy for ${interaction.user}`
			)
			.setThumbnail(
				"https://freshinbox.com/images/ext/holidays2015/snowball-round.png"
			)
			.addFields(
				{ name: "❄️ Snow points", value: user.snowPoints.toString() },
				{
					name: "Total Collected Snowballs",
					value: user.snowCollects.toString() + " :white_circle:",
					inline: true,
				},
				{
					name: "Total Thrown Snowballs",
					value: user.snowThrown.toString() + " :white_circle:",
					inline: true,
				},
				{
					name: "Total Hits",
					value: user.snowHits.toString() + " 🎯",
					inline: true,
				},
				{
					name: "Total KOs",
					value: user.snowKOs.toString() + " :boxing_glove:",
					inline: true,
				},
				{
					name: "Base Health",
					value: user.snowHealth.toString() + " :heart:",
					inline: true,
				},
				{
					name: "Attack",
					value: user.snowAttack.toString() + " :crossed_swords:",
					inline: true,
				},
				{
					name: "Speed",
					value: (1 / user.snowSpeed).toString() + " :athletic_shoe:",
					inline: true,
				},
				{
					name: "Accuracy",
					value: accuracy.toString() + " %",
					inline: true,
				},
				{
					name: "Current Health",
					value: user.snowCurrentHealth.toString() + " :heart:",
					inline: true,
				}
			);

        interaction.reply({ embeds: [embed], ephemeral: true });
    },
}