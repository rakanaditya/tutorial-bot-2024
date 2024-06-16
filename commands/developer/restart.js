const { SlashCommandBuilder } = require('discord.js');
const config = require('../../config.json');
const fs = require("fs");
module.exports = {
	category: 'developer',
	data: new SlashCommandBuilder()
	.setName('restart')
	.setDescription('Restart a bot.'),

  async execute(message, args) {

  const user = message.options.getUser('target');

   if(message.user.id !== config.ownerID && message.user.id !== "602036985774997507") return message.reply(`command **restart** khusus developer kontol`);


message.channel.send('Restarting...').then(msg => {
            setTimeout(() => {
                msg.edit('Restarted successfully!');
                process.exit(1); // This will restart the bot
            }, 1000); // Adjust the time delay as needed
        });
    },
};