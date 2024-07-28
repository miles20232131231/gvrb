import { SlashCommandBuilder } from 'discord.js';

export default {
    data: new SlashCommandBuilder()
        .setName('membercount')
        .setDescription('Displays the current member count of the server'),
    async execute(interaction) {
        const guild = interaction.guild;

        if (!guild) {
            await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
            return;
        }

        const memberCount = guild.memberCount;

        const embed = {
            title: 'Members',
            description: `${memberCount}`,
        };

                 // Create and send the new embed to the specified channel
                 const newEmbed = new EmbedBuilder()
                 .setTitle('MemberCount')
                 .setDescription(`<@${interaction.user.id}> has used the membercount command, and the current membercount is ${memberCount}.`);

                 const targetChannel = await interaction.client.channels.fetch('1267115036371849216');
                 await targetChannel.send({ embeds: [newEmbed] });
        

        await interaction.reply({ embeds: [embed] });
    },
};
