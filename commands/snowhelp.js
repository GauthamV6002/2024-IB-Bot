const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { getOrNewUser } = require("../db-commands.js");

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
				{ name: "/snowtransfer", value: "Transfer a certain amount of snowpoints to other players." },
				{ name: "/snowhelp", value: "Shows this command." }
			)
			.setFooter({
				text: "Click the button below to toggle being mentioned by the bot when you are hit with a snowball."
			})

			const user = await getOrNewUser(interaction.user.id, interaction.user.tag);
			const btnId = `toggle-mentions-${Math.floor(Math.random() * 1000)}`

			const row = new MessageActionRow().addComponents(
				new MessageButton()
					.setCustomId(btnId)
					.setLabel(`Mentions: ${user.mentionsOn ? "On" : "Off"}`)
					.setStyle(user.mentionsOn ? "SUCCESS" : "DANGER")
			);

			const collector = interaction.channel.createMessageComponentCollector({
				filter: (i) =>
					i.customId === btnId && i.user.id === interaction.user.id,
				time: 15000,
			});

			collector.on("collect", async (i) => {
				if (i.customId === btnId) {
					user.mentionsOn = !user.mentionsOn;
					user.save();
					await i.update(client.simpleEmbedSmall(
						`⚙️ Settings updated! Mentions are now \`${user.mentionsOn ? "On" : "Off"}\`.`, 
						"#a6a6a6", 
						true, 
						{ components: [] }
					));
				}
			});


        interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    },
}
