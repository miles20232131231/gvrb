import dotenv from 'dotenv';
import { Client, Collection, GatewayIntentBits } from 'discord.js';
import fs from 'fs';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

// Load environment variables
await dotenv.config();

const token = process.env.token;
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
client.commands = new Collection();
client.commandArray = [];

// Handle Events
const handleEvents = async () => {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const { default: event } = await import(`./events/${file}`);
        if (event.once) client.once(event.name, (...args) => event.execute(...args, client));
        else client.on(event.name, (...args) => event.execute(...args, client));
    }
};

// Handle Commands
const handleCommands = async () => {
    const commandFolders = fs.readdirSync('./commands');
    for (const folder of commandFolders) {
        const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));

        for (const file of commandFiles) {
            const { default: command } = await import(`./commands/${folder}/${file}`);
            if (!command || !command.data || !command.data.name) {
                console.error(`The command at ./commands/${folder}/${file} is missing a required "data" or "name" property.`);
                continue;
            }
            client.commands.set(command.data.name, command);
            client.commandArray.push(command.data.toJSON());
        }
    }

    const clientId = '1267108275992662040';
    const guildId = '1129907473881501757'; 
    const rest = new REST({ version: '9' }).setToken(token);

    try {
        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: client.commandArray,
        });
        console.log('Slash commands uploaded');
    } catch (error) {
        console.error('Error uploading commands:', error);
    }
};

client.handleEvents = handleEvents;
client.handleCommands = handleCommands;

(async () => {
    await client.handleEvents();
    await client.handleCommands();
})();

client.login(token);
