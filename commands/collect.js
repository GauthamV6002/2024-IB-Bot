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

        const offlineMsg = "You can't collect when offline/invisible!";
		try {	
			if(userMember.presence.status === "offline"){
				interaction.reply(client.simpleEmbedSmall(offlineMsg, "#34ebeb", true));
				return;
			}
		} catch (e) {
			interaction.reply(client.simpleEmbedSmall(offlineMsg, "#34ebeb", true));
			return;
		}

        const user = await getOrNewUser(interaction.user.id, interaction.user.tag);
        if (user.snowCurrentSnowballs >= client.maxSnowballs){
			interaction.reply(client.simpleEmbedSmall("🪣 You're already at 10 snowballs! Throw with `/throw` one to free up some space.", "#34ebeb", true));
            
            return;
        } else {
            user.snowCurrentSnowballs++;    
        }

        const msg = `🌨️ Collected a snowball! Your inventory: ${":white_circle: ".repeat(user.snowCurrentSnowballs)}`
        interaction.reply(client.simpleEmbedSmall(msg, "#34ebeb", true));

        user.snowCollects++;
		await user.save();

    },
    cooldown: 30 * 1000,
}