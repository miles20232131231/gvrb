import { SlashCommandBuilder } from '@discordjs/builders';
import { EmbedBuilder, PermissionFlagsBits, PermissionsBitField } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('over')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .setDescription('Purges messages from today between specified start and end times.')
        .addStringOption(option =>
            option.setName('start-time')
                .setDescription('Start time in HH:MM format')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('end-time')
                .setDescription('End time in HH:MM format')
                .setRequired(true)),
    async execute(interaction) {
        const startTime = interaction.options.getString('start-time');
        const endTime = interaction.options.getString('end-time');
        
        // Get today's date and set the time for start and end
        const now = new Date();
        const start = new Date(now);
        const [startHours, startMinutes] = startTime.split(':').map(Number);
        start.setHours(startHours, startMinutes, 0, 0);
        
        const end = new Date(now);
        const [endHours, endMinutes] = endTime.split(':').map(Number);
        end.setHours(endHours, endMinutes, 0, 0);

        // Fetch messages from the channel
        const messages = await interaction.channel.messages.fetch({ limit: 100 });

        // Filter messages from today between the specified times
        const messagesToDelete = messages.filter(msg => {
            const msgDate = new Date(msg.createdTimestamp);
            return msgDate >= start && msgDate <= end;
        });

        // Delete the filtered messages
        await interaction.channel.bulkDelete(messagesToDelete);

        // Create an embed with the details
        const embed = new EmbedBuilder()
            .setTitle('GVRB | Session Concluded')
            .setDescription(`Thank you for joining the Greenville Roleplay Branch session hosted by <@${interaction.user.id}>. Your participation is valued, and we're excited to have you with us. We hope you had an enjoyable experience throughout the event.

__**Session Details:**__

Host: <@${interaction.user.id}>
Start Time: ${startTime}
End Time: ${endTime}

Your presence contributes to making this session a success. Let's make it a memorable event together! `)
            .setFooter({
                text: 'Greenville Roleplay Branch',
                iconURL: 'https://cdn.discordapp.com/icons/1129907473881501757/030a5509f09b03a537c7c28b4396eccb.png?size=4096'
            });

        // Create and send the new embed to the specified channel
         const newEmbed = new EmbedBuilder()
         .setTitle('Session Over')
         .setDescription(`<@${interaction.user.id}> has ended their session The information is provided below..
            
            **Session Information**
            Start time:${startTime}
            End time:${endTime}.`);

         const targetChannel = await interaction.client.channels.fetch('1267115036371849216');
         await targetChannel.send({ embeds: [newEmbed] });

        // Send the embed to the channel
        await interaction.channel.send({ embeds: [embed] });

        // Send an ephemeral confirmation message
        await interaction.reply({ content: 'Command sent below.', ephemeral: true });
    },
};
