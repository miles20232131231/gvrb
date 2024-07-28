import { InteractionType } from 'discord.js';

export default {
    name: 'interactionCreate',
    async execute(interaction, client) {
        try {
            if (interaction.isCommand()) {
                const { commands } = client;
                const command = commands.get(interaction.commandName);
                if (command) {
                    await command.execute(interaction, client);
                }
            }
        } catch (error) {
            console.error('Error handling interaction:', error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error executing this command!', ephemeral: true });
            }
        }
    },
};
