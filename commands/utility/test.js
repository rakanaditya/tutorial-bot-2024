const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    category: 'Slash',
    cooldown: 5,
	  data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('haha'),
 
  //  .addStringOption(option => option.setName('ping')//buat pilihan
//	.setRequired(true)),
	async execute(interaction) {

const user = interaction.options.getUser('target');
 if(interaction.user.id !== "602036985774997507" && interaction.user.id !== "602036985774997507") return interaction.reply(`command **testt** khusus developer`);
		await interaction.reply('kontol!');
	},
};