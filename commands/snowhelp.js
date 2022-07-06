const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snowhelp')
        .setDescription('Official Help Command for the snowfight.'),
    async execute(interaction, client) {    
        const embed = new MessageEmbed()
			.setColor("#b3fcff")
			.setTitle("Snow Help")
			.setDescription(`A list of commands for the snowball fight! All commands use the *slash* feature on discord.`)
			.addFields(
				{ name: "/collect", value: "Collect a snowball." },
				{ name: "/throw [@target]", value: "Throw a a snowball at someone!" },
				{ name: "/snowstats", value: "Get your statitics for the snowball fight. Shows attack, max health, snow points, and more. Wondering why its so complicated? We're ib." },
				{ name: "/leaderboard", value: "Shows the snowball fight leaderboard, organized by snowpoints." },
				{ name: "/store", value: "A store to buy items for the snowball fight." },
				{ name: "/snowhelp", value: "Shows this command." }
			);
        interaction.reply({ embeds: [embed], ephemeral: true });
    },
}