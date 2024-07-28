import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('reinvites')
        .setDescription('Session Reinvites.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addStringOption(option =>
            option.setName('link-reinvites')
                .setDescription('Reinvites Link')
                .setRequired(true)),
    async execute(interaction) {
        const reinvitesLink = interaction.options.getString('link-reinvites');
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('GVRB | Reinvites')
            .setDescription(`${user} has released the reinvites link. Leaking the session would result in a server ban. Follow all the rules that the host has provided for you.`)
            .setFooter({
                text: 'Greenville Roleplay Branch',
                iconURL: 'https://cdn.discordapp.com/icons/1129907473881501757/030a5509f09b03a537c7c28b4396eccb.png?size=4096'
            });

        // Create a button
        const button = new ButtonBuilder()
            .setCustomId('say_hi_button')
            .setLabel('Reinvites')
            .setStyle(ButtonStyle.Primary);

        // Create an action row with the button
        const row = new ActionRowBuilder()
            .addComponents(button);

        // Create and send the new embed to the specified channel
        const newEmbed = new EmbedBuilder()
            .setTitle('Session Reinvites')
            .setDescription(`<@${interaction.user.id}> has released reinvites.\n\n**Reinvites Link**\n${reinvitesLink}`);

        const targetChannel = await interaction.client.channels.fetch('1267115036371849216');
        await targetChannel.send({ embeds: [newEmbed] });

        // Send the embed message with the button
        const message = await interaction.channel.send({ content: 'hi', embeds: [embed], components: [row] });
        
        // Send an ephemeral confirmation message
        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

        // Handle the button interaction
        const filter = i => i.customId === 'say_hi_button' && i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'say_hi_button') {
                await i.reply({ content: '${link-reinvites}', ephemeral: true });
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    },
};
