const { MessageActionRow, MessageEmbed, MessageSelectMenu } = require('discord.js');
const { getUser } = require('../db-commands.js');

module.exports = {
    async createElection(client, channelId){
        const channel = client.channels.cache.get(channelId);
        const rand = Math.floor(Math.random() * 100000);
        
        const embed = new MessageEmbed()
			.setColor("#b3fcff")
			.setTitle("2022 Summer Dictator Election")
			.addFields(
				{ name: "Alex G", value: "vote for me, because if you don't i will climb to power and make sure you regret it" },
				{ name: "Emily U:", value: " ._. froge [@target]" },
				{ name: "Eric L:", value: "insert slogan here" },
				{ name: "Fidel Castro (Raif Z):", value: "No Slogan :(" },
				{ name: "Jason L:", value: "Let The Jason Li Begin. Did Somebody Say Jason Li?" },
				{ name: "Joey Z:", value: "No Slogan :(" },
				{ name: "Jonathan X:", value: "bottom text" }
			)

        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId(`election-select-${rand}`)
                .setPlaceholder('Select a candidate.')
                .addOptions([
                    { label: 'Alex G', value: 'Alex G'},
                    { label: 'Emily U', value: 'Emily U'},
                    { label: 'Eric L', value: 'Eric L'},
                    { label: 'Fidel Castro (Raif Z)', value: 'Fidel Castro (Raif Z)'},
                    { label: 'Jason L', value: 'Jason L'},
                    { label: 'Joey Z', value: 'Joey Z'},
                    { label: 'Jonathan X', value: 'Jonathan X'},
                ])
        );

        channel.send({
            embeds: [embed],
            components: [row]
        });

        
        client.on('interactionCreate', async (i) => {
            if (!i.isSelectMenu()) return;
        
            if (i.customId === `election-select-${rand}`) {
                const { values } = i;
                botUser = await getUser("901273742901133393");

                const miscCopy = { ...botUser.misc };
                miscCopy[i.user.id] = values[0];
                botUser.misc = miscCopy;
                
                botUser.save();
                i.reply(client.simpleEmbedSmall("Your vote was cast!", "#b3fcff", true));
            }
        });

        
        
    },
}

