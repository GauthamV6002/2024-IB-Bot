const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('collect')
        .setDescription('Collect & Make a Snowball'),
    async execute(interaction, client) {
        if(client.snowballInfo.hasOwnProperty(interaction.user.id)){ //MUST HAVE "COUNT" ON INITIALIZATION
            if (client.snowballInfo[interaction.user.id]["count"] >= client.maxSnowballs){
				interaction.reply("🪣 You're already at 10 snowballs! Throw with /throw one to free up some space.");
                return;
            } else {
                client.snowballInfo[interaction.user.id]["count"]++;    
            }

        } else {
            client.snowballInfo[interaction.user.id] = {};
            client.snowballInfo[interaction.user.id]["count"] = 1;
            client.snowballInfo[interaction.user.id]["health"] = client.snowballMaxHealth;
            client.snowballInfo[interaction.user.id]["lastCreated"] = Date.now();
        }
        const msg = `🌨️ Collected a snowball! Your inventory: ${":white_circle: ".repeat(client.snowballInfo[interaction.user.id]["count"])}`
        interaction.reply({ content: msg, ephemeral: true });
    },
    cooldown: 30 * 1000,
}