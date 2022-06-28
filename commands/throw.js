const { SlashCommandBuilder } = require('@discordjs/builders')

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
		const { snowballMaxHealth, snowballHitDamage, KOtimeout } = client;
		if (
			!client.snowballInfo.hasOwnProperty(interaction.user.id) ||
			client.snowballInfo[interaction.user.id]["count"] <= 0
		) {
			interaction.reply(
				"❌ You have no snowballs! Make one with /collect."
			);
			return;
		}

		target = interaction.options.getUser("target");

		if (Math.random() <= client.snowballHitChance) {
			if (client.snowballInfo.hasOwnProperty(target.id)) {
				if (
					client.snowballInfo[target.id]["health"] -
						client.snowballHitDamage <=
					0
				) {
					target.timeout(KOtimeout * 1000);
					client.snowballInfo[target.id]["health"] =
						snowballHitDamage;
					interaction.reply(
						`KO! Now, ${target}, shut up for ${KOtimeout} seconds.`
					);
					return;
				}

				client.snowballInfo[target.id]["health"] -= snowballHitDamage;
				client.snowballInfo[target.id]["count"] = 0;
				interaction.reply(
					`🎯 The snowball Hit! ${target} is now at ${
						client.snowballInfo[target.id]["health"]
					} Health!`
				);
			} else {
				client.snowballInfo[target.id] = {};
				client.snowballInfo[target.id]["count"] = 0;
				client.snowballInfo[target.id]["health"] = snowballMaxHealth;
				interaction.reply({
					content: "😔 Oops, you missed!",
					ephemeral: true,
				});
			}
		} else
			interaction.reply({
				content: "😔 Oops, you missed!",
				ephemeral: true,
			});

		client.snowballInfo[interaction.user.id]["count"]--;
	},
	cooldown: 15 * 1000,
};