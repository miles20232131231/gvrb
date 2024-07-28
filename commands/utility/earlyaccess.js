import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionFlagsBits, PermissionsBitField } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('ea')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .setDescription('Sends the early access embed.')
        .addStringOption(option =>
            option.setName('session-link')
                .setDescription('Link for the session so that EA people can join.')
                .setRequired(true)),
    async execute(interaction) {
        const sessionLink = interaction.options.getString('session-link');

        const embed = new EmbedBuilder()
            .setTitle('GVRB | Early Access')
            .setDescription(`Early Access is now Released! Nitro Boosters, members of the Emergency Services, and Content Creators can join the session by clicking the button below.\n\nPlease remember, sharing the session link with others is strictly prohibited and may lead to penalties. We appreciate your cooperation in keeping our community secure and fair for everyone.\n`)
            .setFooter({
                text: 'Southwest Florida Roleplay Project',
                iconURL: 'https://cdn.discordapp.com/attachments/1256699793158307930/1256853453108547604/image-modified_3.png?ex=6682477e&is=6680f5fe&hm=80c62147bb1244d86121470ecf0f8e8d3029fdda834d179a682bc259fba94eb6&'
            });

        const button = new ButtonBuilder()
            .setLabel('Early Access')
            .setStyle(ButtonStyle.Secondary)
            .setCustomId('ea');

        const row = new ActionRowBuilder()
            .addComponents(button);

         // Create and send the new embed to the specified channel
         const newEmbed = new EmbedBuilder()
         .setTitle('Session Early Access')
         .setDescription(`<@${interaction.user.id}> has released their session early access, The session link is provided below.
            
            **Session Link**
            ${sessionLink}`);


        // Send the embed message with the button to the channel
        await interaction.channel.send({ content: '<@&1140047710284693709>, <@&1267121769991634944>', embeds: [embed], components: [row] });

        // Send an ephemeral confirmation message
        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

        // Create a collector to handle the button interaction
        const filter = i => i.customId === 'ea';
        const collector = interaction.channel.createMessageComponentCollector({ filter, componentType: ComponentType.BUTTON, time: 9999999 });

        collector.on('collect', async i => {
            try {
                if (i.member.roles.cache.has('1264343534861815818') || i.member.roles.cache.has('1140047710284693709') || i.member.roles.cache.has('1267121769991634944')) {
                    await i.reply({ content: `${sessionLink}`, ephemeral: true });
                } else {
                    await i.reply({ content: `Nuh uh, you do not have the early access role.`, ephemeral: true });
                }
            } catch (error) {
                console.error('Error responding to interaction:', error);
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    },
};
