const { SlashCommandBuilder } = require('@discordjs/builders')
const { createRoleButton } = require('../single-use/role-button.js')
const { createElection } = require('../single-use/election.js')

const BTN_CHANNEL = "994703495846449162";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admin')
        .setDescription('Admin Command')
        .addStringOption(option =>
            option.setName('cmd')
                .setDescription('Command (classes, election)')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('args')
                .setDescription('Arguments')
                .setRequired(true)),
    async execute(interaction, client) {
        if (interaction.user.id !== "901273742901133393" && interaction.user.id !== "750762193078976622"){
			interaction.reply({ content: "This command is only meant for bot developer(s) & admins.", ephemeral: true });
			return;
		}

        const cmd = interaction.options.getString('cmd');
        const args = interaction.options.getString('args');
        if(cmd === "classes") createRoleButton(client, args);
        else if(cmd === "election") createElection(client, args);
    },
}