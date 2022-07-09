const { SlashCommandBuilder } = require('@discordjs/builders')
const { Modal, MessageActionRow, TextInputComponent } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bugreport')
        .setDescription('Report a bug in the IB Bot or the Q/A Bot.'),
    async execute(interaction, client) {
        modal = new Modal().setCustomId('bug-report-modal').setTitle('Report a Bug');
        
        const firstActionRow = new MessageActionRow().addComponents(
            new TextInputComponent()
                .setCustomId('bug-report-subject')
                .setLabel('Subject/Topic')
                .setStyle('SHORT')
                
        );
         const secondActionRow = new MessageActionRow().addComponents(
            new TextInputComponent()
                .setCustomId('bug-report-description')
                .setLabel('Description')
                .setStyle('PARAGRAPH')
        );
        
        modal.addComponents(firstActionRow, secondActionRow);
        await interaction.showModal(modal);

        client.on("interactionCreate", (i) => {
			if (!i.isModalSubmit()) return;
			const subject = i.fields.getTextInputValue("bug-report-subject");
			const description = i.fields.getTextInputValue("bug-report-description");
            client.users.fetch("901273742901133393", false).then((user) => {
                const msg = `===================================================================\n**Bug Report #${Math.floor(Math.random() * 10000)}: \`${subject}\`**\n**Submitted by** \`${i.user.tag}\`\n\n**Description:** ${description}`
				user.send(msg);
			});
			i.reply({
				content: `✅ Your bug report: \`${subject}\` was submitted.`,
				ephemeral: true,
			});
		});
    },
}