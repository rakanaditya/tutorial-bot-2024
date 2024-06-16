const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {

 data: new SlashCommandBuilder()
	.setName('info')
	.setDescription('Get info about a user or a server!')
	.addSubcommand(subcommand =>
		subcommand
			.setName('user')
			.setDescription('Info about a user')
			.addUserOption(option => option.setName('target').setDescription('The user')))
	.addSubcommand(subcommand =>
		subcommand
			.setName('server')
			.setDescription('Info about the server')),
  

	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'user') {
			const user = interaction.options.getUser('target');

			if (user) {
         let usere = new EmbedBuilder()
    .setTitle('User')
    .setColor('#bc0000')
    .setDescription(`Username ${user.username} ID (${user.id})`)
    .setTimestamp()
				 await interaction.reply({ embeds: [usere] })
			} else {
         let usere2 = new EmbedBuilder()
    .setTitle('Username')
    .setColor('#bc0000')
    .setDescription(` Your username ${interaction.user.username} ID (${interaction.user.id})`)
    .setTimestamp()
				await interaction.reply({ embeds: [usere2] })
			}
		} else if (interaction.options.getSubcommand() === 'server') {
       let server = new EmbedBuilder()
    .setTitle('Server')
    .setColor('#bc0000')
    .setDescription(` Your Server ${interaction.guild.name} Total Members (${interaction.guild.memberCount})`)
    .setTimestamp()
			await interaction.reply({ embeds: [server] })
		}
	},
};