const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const config = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();

// Load commands
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    require('./utils/youtubeChecker')(client);
});

// Slash commands handler
client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (command) await command.execute(interaction);
});

// Welcome
const welcomeImage = require('./utils/welcomeImage');

client.on('guildMemberAdd', async (member) => {
    const channel = member.guild.systemChannel;
    if (!channel) return;

    try {
        const image = await welcomeImage(member);

        await channel.send({
            content: `🔥 Welcome ${member}!`,
            files: [{
                attachment: image,
                name: "welcome.png"
            }]
        });

    } catch (err) {
        console.error("Welcome Error:", err);
    }
});

client.login(process.env.token);