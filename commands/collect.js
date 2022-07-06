const { SlashCommandBuilder } = require('@discordjs/builders')
const { getOrNewUser, getOrNewSnowballUserCache } = require("../db-commands.js");
const { guildId } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('collect')
        .setDescription('Collect & Make a Snowball'),
    async execute(interaction, client) {
        if(client.checkKO(client, interaction)) return;

        const guild = client.guilds.cache.get(guildId);
		const userMember = guild.members.cache.get((interaction.user.id).toString());

		try {	
			if(userMember.presence.status === "offline"){
				interaction.reply({ content: "You can't collect when offline/invisible!", ephemeral: true });
				return;
			}
		} catch (e) {
			interaction.reply({ content: "You can't collect when offline/invisible!", ephemeral: true });
			return;
		}

        const user = await getOrNewUser(interaction.user.id, interaction.user.tag);
        if (user.snowCurrentSnowballs >= client.maxSnowballs){
			interaction.reply({content: "🪣 You're already at 10 snowballs! Throw with /throw one to free up some space.", ephemeral: true });
            return;
        } else {
            user.snowCurrentSnowballs++;    
        }

        const msg = `🌨️ Collected a snowball! Your inventory: ${":white_circle: ".repeat(user.snowCurrentSnowballs)}`
        interaction.reply({ content: msg, ephemeral: true });

        user.snowCollects++;
		await user.save();

    },
    cooldown: 30 * 1000,
}