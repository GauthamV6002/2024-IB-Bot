const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { execute } = require("../commands/selectclasses.js")

module.exports = {
    async createRoleButton(client, channelId){
        const channel = client.channels.cache.get(channelId);
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('roles-btn')
                .setLabel('Choose Classes')
                .setStyle('SUCCESS')
        );

        channel.send({
            embeds: [{
                title: "Selecting Classes",
                color: "#a1edc3",
                description: "Clicking the button below will show a popup allowing you to select either Full or Partial IB, as well as all your IB courses."
            }],
            components: [row]
        });
        
        
        client.on('interactionCreate', async (i) => {
            //Executes cmd from selectclasses on i interaction
            if (i.customId === `roles-btn`) execute(i, client);
        });
        
    },
}

