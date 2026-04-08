const { REST, Routes } = require('discord.js');
const fs = require('fs');
const config = require('./config.json');

const GUILD_ID = "1483037426967511170"; // 👈 only this you add

// Load commands
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(config.token);

(async () => {
    try {
        console.log("🚀 Deploying commands...");

        // Auto get client ID from token
        const app = await rest.get(Routes.oauth2CurrentApplication());

        await rest.put(
            Routes.applicationGuildCommands(app.id, GUILD_ID),
            { body: commands }
        );

        console.log("✅ Commands deployed successfully");

    } catch (error) {
        console.error(error);
    }
})();