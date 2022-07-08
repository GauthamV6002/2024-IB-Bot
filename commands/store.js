const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { getOrNewUser } = require("../db-commands.js");

const collectors = []; //i give up
const stopCollectors = () => {
	collectors.map((c) => c.stop());
}

const storeItems = [
	{
		id: "snow-armour",
		name: "Snow Armour",
		effect: "+10 Base Health",
		emoji: "🛡️",
		stat: "snowHealth",
		cost: 50,
		adder: 10,
		cap: 80,
		timer: null,
	},
	{
		id: "training-weights",
		name: "Training Weights",
		effect: "+10 Base Attack",
		emoji: "🏋️",
		stat: "snowAttack",
		cost: 50,
		adder: 10,
		cap: 60,
		timer: null,
	},
	{
		id: "ice-skates",
		name: "Ice Skates",
		effect: "+25% Base Speed for 1 minute.",
		emoji: "⛸️",
		stat: "snowSpeed",
		cost: 20,
		adder: -0.3,
		cap: null,
		timer: 60 * 1000,
	},
	{
		id: "snow-cannon",
		name: "Snow Cannon",
		effect: "Instant KO! Lasts 1 minute.",
		emoji: "🔫",
		stat: "snowAttack",
		cost: 10,
		adder: 10000,
		cap: null,
		timer: 60 * 1000,
	},
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('store')
        .setDescription('Open the snow store to by powerups & stat buffs!'),
    async execute(interaction, client) {
        const embed = new MessageEmbed()
            .setColor('#9ce9ff')
            .setTitle('Snow Shop')
            .setDescription('Buy items using snow points (:snowflake:) to increase your stats in the snowball fight!')
            .addFields(storeItems.map(item => ({
                name: `${item.emoji} ${item.name}`, 
                value: `(${item.cost} :snowflake:) ${item.effect}`,
            })))
            .setFooter({ text: "Click the buttons below to purchase an item!\nPopup times out in 60 seconds."});
        
        const createPurchaseBtn = (item) => {
            const collector = interaction.channel.createMessageComponentCollector({
                filter: (i) => i.customId === item.id && i.user.id === interaction.user.id,
                time: 60000,
            });
			collectors.push(collector);
            
            collector.on("collect", async (i) => {
                user = await getOrNewUser(i.user.id)
                if (user.snowPoints - item.cost < 0) {
                    i.update({
						content: `You're too poor. You only have ${user.snowPoints} :snowflake:.`,
						ephemeral: true,
						embeds: [],
						components: [],
					});
					stopCollectors()
				} else if (user[item.stat] + item.adder > Number(item.cap) && item.cap) {
					i.update({
						content: `❌ You can't buy anymore of this item! The cap for this item is ${item.cap}.`,
						ephemeral: true,
						embeds: [],
						components: [],
					});
					stopCollectors();
				} else {
					user.snowPoints -= item.cost;
					user[item.stat] += item.adder;
					user.save();

					if (item.timer) {
						setTimeout(() => {
							user[item.stat] -= item.adder;
							user.save();
						}, item.timer);
					}

					i.update({
						content: `${item.emoji} ${item.name} was successfully bought by ${interaction.user}!`, 						ephemeral: true,
						embeds: [],
						components: []
					});
					stopCollectors();
				}
            });

			return new MessageButton()
				.setCustomId(item.id)
				.setLabel(`${item.emoji}  (${item.cost}❄️)`)
				.setStyle("PRIMARY");
		};

        const row = new MessageActionRow().addComponents(
			storeItems.map((item) => createPurchaseBtn(item))
		);

        interaction.reply({
			embeds: [embed],
			components: [row],
			ephemeral: true,
		});
    },
}