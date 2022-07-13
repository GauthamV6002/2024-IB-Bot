const { SlashCommandBuilder } = require('@discordjs/builders');
const { getOrNewUser } = require("../db-commands.js");
const { guildId, clientId } = require("../config.json");

const BOT_IDS = [
	"993624726066962442",
	"235148962103951360",
	"155149108183695360",
	"547905866255433758",
	"889078613817831495",
	"993622734246527006"
]; //ib, carl, dyno, hydra, leo, physics

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
			interaction.reply(client.simpleEmbedSmall("Why are you shooting at yourself?", "#34ebeb", true))
			return;
		}
		if (interaction.options.getUser("target").id === clientId){
			interaction.reply(client.simpleEmbedSmall("You dare strike me? Do it again and I'll remove all your snow points!", "#34ebeb"));
			
			return;
		}
		if(BOT_IDS.includes(interaction.options.getUser("target").id)){
			interaction.reply(client.simpleEmbedSmall("Bruh no farming bots", "#34ebeb", true))
			return;
		}
		const guild = client.guilds.cache.get(guildId);
		const targetMember = guild.members.cache.get((interaction.options.getUser("target").id).toString());
		const userMember = guild.members.cache.get((interaction.user.id).toString());

		const offlineMsg = "You can't throw if you are offline, or throw at offline people!";
		try {	
			if(targetMember.presence.status === "offline" || userMember.presence.status === "offline"){
				interaction.reply(client.simpleEmbedSmall(offlineMsg, "#34ebeb", true));
				return;
			}
		} catch (e) {
			interaction.reply(client.simpleEmbedSmall(offlineMsg, "#34ebeb", true));
			return;
		}


		if (client.checkKO(client, interaction)) return; //reply in checkKO()

		const user = await getOrNewUser(interaction.user.id, interaction.user.tag);
		const target = await getOrNewUser(
			interaction.options.getUser("target").id,
			interaction.options.getUser("target").tag
		);

		if(user.snowCurrentSnowballs <= 0){
			interaction.reply(client.simpleEmbedSmall("❌ You have no snowballs! Make one with `/collect`.", "#34ebeb", true));
			return;
		}

		if (Math.random() <= target.snowSpeed) {
			if(target.snowCurrentHealth - user.snowAttack <= 0){
				target.snowCurrentHealth = target.snowHealth;
				const koMsg = `:boxing_glove: **KO!** ${interaction.options.getUser("target")} was hit!`
				interaction.reply(client.simpleEmbedSmall(koMsg, "#34ebeb"));
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
				const hitMsg = `🎯 The snowball hit! ${interaction.options.getUser("target")} is now at ${target.snowCurrentHealth} Health!`
				interaction.reply(client.simpleEmbedSmall(hitMsg, "#34ebeb"));
				user.snowPoints++;
				user.snowHits++;
			}	
		} else {
			const missMsg = `😔 Oops, you missed your shot at ${interaction.options.getUser("target")}!`
			interaction.reply(client.simpleEmbedSmall(missMsg, "#34ebeb"));
		}
		user.snowCurrentSnowballs--;
		user.snowThrown++;
		user.save();
		target.save();
	}
};