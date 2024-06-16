const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const db = require ("quick.db")
module.exports = {
      category: 'help',
      aliases: ["h"],
      usage: "!help",
	   data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Info all commands bot'),

async execute(interaction) {


 let help = new EmbedBuilder()
    .setTitle("Command List")//udah
  //  .setColor('RANDOM')
    .setThumbnail("https://cdn.discordapp.com/attachments/814358022398410763/817247787850268673/ezgif.com-video-to-gif.gif")
    .setDescription(`View all commandsbot`)
    .addFields({ name: '/Help', value: "``View all command bots``"})

    .addFields({ name: '/Moderator', value: "``/kick`` ``/ban``"})

    .addFields({ name: '/Utility', value: "``/ping`` ``/reload``"})

    .addFields({ name: '/Info', value: "``/user``"})
    .setTimestamp()
    interaction.reply({ embeds: [help] });
   // const message = await interaction.fetchReply();
  //	message.react('👍');
}
};