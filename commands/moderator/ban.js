const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

module.exports = {
     category: 'moderator',
      cooldown: 5,
	   data: new SlashCommandBuilder()
		.setName('ban')
		.setDescription('Select a member and ban them.')
		.addUserOption(option => option
				.setName('target')
				.setDescription('The member to ban')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('The reason for banning'))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

async execute(interaction, ) {

		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';


     let banEmbed = new EmbedBuilder()
    .setTitle('Ban')
    .setColor('#bc0000')
    .setDescription(`Banned ${target.username} ID (${target.id})`)
    .addFields({ name: 'Moderator', value: `${interaction.user.username}`, inline: true,})
    .addFields({ name: 'Banned Reason', value: `${reason}`, inline: true,})
    .setTimestamp()
    await interaction.reply({ embeds: [banEmbed] })
		await interaction.guild.members.ban(target);}
}