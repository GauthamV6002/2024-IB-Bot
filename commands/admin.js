const { SlashCommandBuilder } = require('@discordjs/builders')
const { createRoleButton } = require('../single-use/role-button.js')

const BTN_CHANNEL = "994703495846449162";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin Command')
        .addStringOption(option =>
            option.setName('args')
                .setDescription('Arguments')
                .setRequired(true)),
    async execute(interaction, client) {
        if (interaction.user.id !== "901273742901133393"){
			interaction.reply({ content: "This command is only meant for bot developer(s) & admins.", ephemeral: true });
			return;
		}
        
        const args = interaction.options.getString('args');
        createRoleButton(client, args);
        interaction.reply({content: "Test completed.", ephemeral: true })
    },
}