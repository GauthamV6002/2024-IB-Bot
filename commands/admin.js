const { SlashCommandBuilder } = require('@discordjs/builders')
const { createRoleButton } = require('../single-use/role-button.js')

const BTN_CHANNEL = "994703495846449162";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin Command'),
    async execute(interaction, client) {
        if (interaction.user.id !== "901273742901133393"){
			interaction.reply({ content: "This command is only meant for bot developer(s) & Admins.", ephemeral: true });
			return;
		}

        createRoleButton(client, BTN_CHANNEL);
        interaction.reply({content: "Test completed.", ephemeral: true })
    },
}