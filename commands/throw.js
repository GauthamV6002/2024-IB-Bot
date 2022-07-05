const { SlashCommandBuilder } = require('@discordjs/builders');
const { getOrNewUser } = require("../db-commands.js");
const { guildId } = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("throw")
		.setDescription("Throw a snowball!")
		.addUserOption((option) =>
			option
				.setName("target")
				.setDescription("Who are you throwing at?")
				.setRequired(true)
		),
	async execute(interaction, client) {
		if(interaction.options.getUser("target").id === interaction.user.id){
			interaction.reply({content: "Why are you shooting at yourself?", ephemeral: true})
			return;
		}
		if (interaction.options.getUser("target").id === "989378114813583381"){
			interaction.reply("You dare strike me? Do it again and I'll remove all your snow points!");
			return;
		}
		const guild = client.guilds.cache.get(guildId);
		const targetMember = guild.members.cache.get((interaction.options.getUser("target").id).toString());
		const userMember = guild.members.cache.get((interaction.user.id).toString());


		try {	
			if(targetMember.presence.status === "offline" || userMember.presence.status === "offline"){
				interaction.reply("You can't throw if you are offline, or throw at offline people!");
				return;
			}
		} catch (e) {
			interaction.reply("You can't throw if you are offline, or throw at offline people!");
			return;
		}


		if (client.checkKO(client, interaction)) return; //reply in checkKO()

		const user = await getOrNewUser(interaction.user.id, interaction.user.tag);
		const target = await getOrNewUser(
			interaction.options.getUser("target").id,
			interaction.options.getUser("target").tag
		);

		if(user.snowCurrentSnowballs <= 0){
			interaction.reply({content: "❌ You have no snowballs! Make one with /collect.", ephemeral: true});
			return;
		}

		if (Math.random() <= target.snowSpeed) {
			if(target.snowCurrentHealth - user.snowAttack <= 0){
				target.snowCurrentHealth = target.snowHealth; 
				interaction.reply(`:boxing_glove: **KO!** ${interaction.options.getUser("target")} was hit!`);
				client.snowKOs[interaction.options.getUser("target").id] = true;
				setTimeout(() => {
					client.snowKOs[interaction.options.getUser("target").id] = false;
				}, client.KOtimeout);

				target.snowPoints--;
				target.snowCurrentSnowballs = 0;
				user.snowKOs++;
				user.snowHits++;
				user.snowPoints += 2;
			} else {
				target.snowCurrentHealth -= user.snowAttack;
				interaction.reply(
					`🎯 The snowball hit! ${interaction.options.getUser(
						"target"
					)} is now at ${target.snowCurrentHealth} Health!`
				);
				user.snowPoints++;
				user.snowHits++;
			}	
		} else {
			interaction.reply(`😔 Oops, you missed your shot at ${interaction.options.getUser("target")}!`);
		}
		user.snowCurrentSnowballs--;
		user.snowThrown++;
		user.save();
		target.save();
	}
};