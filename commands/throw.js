const { SlashCommandBuilder } = require('@discordjs/builders');
const { getOrNewUser } = require("../db-commands.js");

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
		if (interaction.options.getUser("target").id === "989378114813583381"){
			interaction.reply("You dare strike me? Do it again and I'll remove all your snow points!");
			return;
		}
		if (client.checkKO(client, interaction)) return;

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
				client.snowKOs[interaction.user.id] = true;
				setTimeout(() => {
					client.snowKOs[interaction.user.id] = false;
				}, client.KOtimeout);

				target.snowPoints--;
				user.snowKOs++;
				user.snowHits++;
				user.snowPoints += 2;
			} else {
				target.snowCurrentHealth -= user.snowAttack;
				target.snowCurrentSnowballs = 0;
				interaction.reply(
					`🎯 The snowball hit! ${interaction.options.getUser(
						"target"
					)} is now at ${target.snowCurrentHealth} Health!`
				);
				user.snowPoints++;
				user.snowHits++;
			}	
		} else {
			interaction.reply("😔 Oops, you missed!");
		}
		user.snowCurrentSnowballs--;
		user.snowThrown++;
		user.save();
		target.save();
	}
};