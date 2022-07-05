const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js");
const { getUsers } = require("../db-commands.js");
const { guildId } = require("../config.json");

const leaderboardLimit = 10;
const ROLE_NAME = "Strongest Right Hand";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Snowball Fight Leaderboards!'),
    async execute(interaction, client) {
        const users = (await getUsers())
        users.sort((a, b) => b.snowPoints - a.snowPoints)
        const tags = users
                        .slice(0, leaderboardLimit)
                        .map((user, index) => (`${index + 1}. ${user.discordTag} (${user.snowPoints} :snowflake:)`))
                        .join("\n")
        
        const embed = new MessageEmbed()
			.setColor("#b3fcff")
			.setTitle("Snowball Fight Leaderboard")
			.setDescription(`1st Place receives the \`\`${ROLE_NAME}\`\` role!`)
			.addFields({ name: "Rankings", value: tags });
        interaction.reply({ embeds: [embed] });

        const role = client.guilds.cache
			.get(guildId)
			.roles.cache.find((r) => r.name === ROLE_NAME);

        users.forEach(async (user) => {
			if (user.isSnowMonarch && user !== users[0]) {
				const member = client.guilds.cache
					.get(guildId)
					.members.cache.get(user.discordID);
                member.roles.remove(role);
				user.isSnowMonarch = false;
				user.save();
			}
		});

        const member = client.guilds.cache
			.get(guildId)
			.members.cache.get(users[0].discordID);
        
        member.roles.add(role);
        users[0].isSnowMonarch = true;
		users[0].save();


    },
}