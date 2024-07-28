import { SlashCommandBuilder } from '@discordjs/builders';
import { ActionRowBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, PermissionsBitField } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('release')
        .setDescription('Releases the session for everyone to join.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that civilians may join.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('peacetime-status')
                .setDescription('Current peacetime status.')
                .addChoices(
                    { name: 'Peacetime On', value: 'On' },
                    { name: 'Peacetime Normal', value: 'Normal' },
                    { name: 'Peacetime Off', value: 'Off' }
                )
                .setRequired(true))
        .addStringOption(option =>
            option.setName('frp-speed')
                .setDescription('FRP speeds.')
                .addChoices(
                    { name: '75', value: '75' },
                    { name: '80', value: '80' },
                    { name: '85 (should not be used frequently)', value: '85' }
                )
                .setRequired(true)),
    async execute(interaction) {
        try {
            const sessionLink = interaction.options.getString('session-link');
            const peacetimeStatus = interaction.options.getString('peacetime-status');
            const frpSpeed = interaction.options.getString('frp-speed');
            const driftingStatus = interaction.options.getString('drifting-status');

            const embed = new EmbedBuilder()
                .setTitle('GVRB | Session Release')
                .setDescription(`The session host has distributed the link to all participants. Click the button below to view and join the session. Should you encounter any issues or have questions, our support team is available to assist you promptly.

**__Session Information:__**

Session Host: <@${interaction.user.id}>
Peacetime Status: ${peacetimeStatus}
FRP Speeds: ${frpSpeed} MPH

Your participation is valued, and we wish you a smooth and enjoyable experience during the session.`)
                .setFooter({
                    text: 'Greenville Roleplay Branch',
                    iconURL: 'https://cdn.discordapp.com/icons/1129907473881501757/030a5509f09b03a537c7c28b4396eccb.png?size=4096'
                });

            const button = new ButtonBuilder()
                .setLabel('Session Link')
                .setStyle(ButtonStyle.Secondary)
                .setCustomId('ls');

            const row = new ActionRowBuilder()
                .addComponents(button);

         // Create and send the new embed to the specified channel
         const newEmbed = new EmbedBuilder()
         .setTitle('Session Release')
         .setDescription(`<@${interaction.user.id}> has released their session, the information is provided below.
            
            **Session Information**
            FRP:${frpSpeed}
            PT:${peacetimeStatus}
            Link:${sessionLink}.`);

         const targetChannel = await interaction.client.channels.fetch('1267115036371849216');
         await targetChannel.send({ embeds: [newEmbed] });

            // Send the embed message with the button to the channel
            await interaction.channel.send({ content: '@everyone', embeds: [embed], components: [row] });

            // Send an ephemeral confirmation message
            await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

            // Create a collector to handle the button interaction
            const filter = i => i.customId === 'ls';
            const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.BUTTON, time: 9999999 });

            collector.on('collect', async i => {
                try {
                    await i.deferUpdate(); // Defer the button update

                    await i.followUp({ content: `${sessionLink}`, ephemeral: true });
                } catch (error) {
                    console.error('Error responding to interaction:', error);
                }
            });

            collector.on('end', collected => {
                console.log(`Collected ${collected.size} interactions.`);
            });
        } catch (error) {
            console.error('Error executing command:', error);
            await interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
        }
    },
};
