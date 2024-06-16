const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

module.exports = {
     category: 'moderator',
      cooldown: 5,
	   data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Select a member and kick them.')
		.addUserOption(option => option
				.setName('target')
				.setDescription('The member to kick')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('reason')
				.setDescription('The reason for kick'))
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.setDMPermission(false),

async execute(interaction) {
		const target = interaction.options.getUser('target');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';
    

     let banEmbed = new EmbedBuilder()
    .setTitle('Ban')
    .setColor('#bc0000')
    .setDescription(`Kick ${target.username} ID (${target.id})`)
    .addFields({ name: 'Moderator', value: `${interaction.user.username}`, inline: true,})
    .addFields({ name: 'Kick Reason', value: `${reason}`, inline: true,})
    .setTimestamp()
		await interaction.reply(`kick ${target.username} for reason: ${reason}`);
		await interaction.guild.members.kick(target);
	},
};