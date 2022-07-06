const { Client, Intents, Collection } = require('discord.js');
const express = require("express");
const { token, MONGO_SRV } = require("./config.json");
const { newUser, updateUser, getUser, getUsers } = require("./db-commands.js");

const mongoose = require("mongoose");

const fs = require("node:fs");
const path = require("node:path");

const app = express();
const PORT = 8080;

mongoose
	.connect(MONGO_SRV)
	.then(() => console.log("Database connected ✅"))
	.catch((e) => console.log(e.message));

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS
	],
});
client.commands = new Collection(); 
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter((file) => file.endsWith(".js"));


for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module

	//RUN MIDDLEWARE
	if(!command.cooldown) command.cooldown = 0;
	command.lastRun = {}

	client.commands.set(command.data.name, command);
}

//GLOBAL CACHE PROPERTIES

client.snowKOs = {} //Player Specific Info
client.maxSnowballs = 10;
client.KOtimeout = 2 * 60 * 1000;

client.checkKO = (c, i) => {
	if (c.snowKOs[i.user.id]) {
		i.reply({
			content:
				":boxing_glove: You've been KO'ed for 2 minutes! You can't use snowball commands in that time.",
			ephemeral: true,
		});
		console.log("run")
		return true;
	}
}


client.login(token);

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		if(!command.lastRun[interaction.user.id]) {
			command.lastRun[interaction.user.id] = Date.now()
			await command.execute(interaction, client);
			return
		}

		if(Date.now() - command.lastRun[interaction.user.id] > command.cooldown){
			command.lastRun[interaction.user.id] = Date.now();
			await command.execute(interaction, client);
		} else {
			interaction.reply({
				content: `⏳ You must wait at least ${command.cooldown / 1000} seconds before command uses!`,
				ephemeral: true,
			})
		}

	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});


app.get("/", async function (req, res) {
	res.send("IB Server Bot!")
})
app.listen(process.env.PORT || PORT, () => console.log("Hosting server is running! 🚀"));

