import { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Deletes a specified number of messages from the channel.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Number of messages to delete')
                .setRequired(true)),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');

        if (amount < 1 || amount > 100) {
            return interaction.reply({ content: 'You need to input a number between 1 and 100.', ephemeral: true });
        }

        await interaction.channel.bulkDelete(amount, true).catch(error => {
            console.error(error);
            return interaction.reply({ content: 'There was an error trying to purge messages in this channel!', ephemeral: true });
        });

        await interaction.reply({ content: `Successfully deleted ${amount} messages.`, ephemeral: true });

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('Purge Command Used')
            .setDescription(`${interaction.user.tag} used the purge command to delete ${amount} messages in <#${interaction.channel.id}>.`)
            .setColor(0xff0000)
            .setTimestamp();

        // Fetch the target channel and send the embed
        const logChannel = await interaction.client.channels.fetch('1267115036371849216');
        await logChannel.send({ embeds: [embed] });
    },
};
