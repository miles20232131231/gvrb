import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, PermissionsBitField, PermissionFlagsBits } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('startup')
        .setDescription('Sends the startup embed.')
        .setDefaultMemberPermissions(PermissionsBitField.Flags.MuteMembers)
        .addIntegerOption(option =>
            option.setName('reactions')
                .setDescription('Amount of reactions for the session to occur')
                .setRequired(true)),
    async execute(interaction) {
        const reactions = interaction.options.getInteger('reactions');
        const user = interaction.user;

        const embed = new EmbedBuilder()
            .setTitle('GVRB | Session Startup')
            .setDescription(`Welcome, ${user} is hosting a session. Before the session starts make sure you have read all the rules provided below. Failing to do so would result in a server punishment.
                
                **Session Rules**
            > Read the banned vehicle list provided below, to get the banned vehicle list link you may click the button below and you will get the button.
            
            > You must always follow all the rules and orders provided by staff members. If you think the order is wrong you can report them at <#1264358155807232010>.
            
            > Make sure you have registered your vehicle by doing /register.`)
            .setImage('https://cdn.discordapp.com/attachments/1264493071362687047/1267113101535481906/Screenshot_2024-07-28_at_9.35.00_AM.png?ex=66a79a89&is=66a64909&hm=31d422ef04bad02fd06ac70ae12d25655f2b1f18a23f96e7aacd1c16f5e0f920&')
            .setFooter({
                text: 'Greenville Roleplay Branch',
                iconURL: 'https://cdn.discordapp.com/icons/1129907473881501757/030a5509f09b03a537c7c28b4396eccb.png?size=4096'
            });

        // Create a button
        const button = new ButtonBuilder()
            .setCustomId('bvl')
            .setLabel('Banned Vehicle List')
            .setStyle(ButtonStyle.Primary);

            // Create and send the new embed to the specified channel
         const newEmbed = new EmbedBuilder()
         .setTitle('Session Startup')
         .setDescription(`<@${interaction.user.id}> has started up a session. The reaction is set to ${reactions}.`);

         const targetChannel = await interaction.client.channels.fetch('1267115036371849216');
         await targetChannel.send({ embeds: [newEmbed] });


        // Create an action row with the button
        const row = new ActionRowBuilder()
            .addComponents(button);

        // Send the embed message with the button
        const message = await interaction.channel.send({ content: '@everyone', embeds: [embed], components: [row] });

        // Add reaction to the embed message
        await message.react('✅'); 

        // Send an ephemeral confirmation message
        await interaction.reply({ content: 'Command Sent Below.', ephemeral: true });

        // Handle the button interaction
        const filter = i => i.customId === 'bvl' && i.user.id === interaction.user.id;
        const collector = message.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async i => {
            if (i.customId === 'bvl') {
                await i.reply({ content: 'https://docs.google.com/document/d/1H98pxdxJ3TXY8UyWoXhKX2IKPyWp7aFVxI10b3Bwcx8/edit?usp=sharing', ephemeral: true });
            }
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} interactions.`);
        });
    },
};
