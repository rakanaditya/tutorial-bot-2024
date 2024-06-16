// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { REST, Routes } = require('discord.js');
const db = require ("quick.db")
// Create a new client instance

const { Client, RichEmbed, Collection, GatewayIntentBits, Events, IntentsBitField, Discord, ActivityType, Partials  } = require("discord.js"); /* PERLU Penting */
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

const mongoose = require("mongoose");
const { clientId, guildId, token, mongodb, prefix, ownerID } = require("./config.json");//config prefix ra!
const uptimerobot = require("./uptimerobot.js"); //uptime robot
const express = require("express"); //hosting
const quickhook = require("quick.hook"); //hosting
const wait = require('node:timers/promises').setTimeout;
const commands  = [];

client.commands = new Collection();
client.cooldowns = new Collection();


// Grab all the command folders from the commands directory you created earlier
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
      client.commands.set(command.data.name, command);
		} else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
}

//message commands
client.messageCommands = new Collection();
const message_commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of message_commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.messageCommands.set(command.data.name, command);
      }
		} 
	}

/* 
} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
*/

/*
for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}
*/




const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}



// messageCommand handler

client.on('messageCreate', (message) => {
  const args = message.content.slice(prefix.length).split(' ');
  const command = args[0];
  if (client.messageCommands.get(command)) {
    let Command = client.messageCommands.get(command);
    Command.execute(message);
  }
});




// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();


client.on(Events.InteractionCreate, interaction => {
	console.log(interaction);
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
	// When a reaction is received, check if the structure is partial
	if (reaction.partial) {
		// If the message this reaction belongs to was removed, the fetching might result in an API error which should be handled
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message:', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}

	// Now the message has been cached and is fully available
	console.log(`${reaction.message.author}'s message "${reaction.message.content}" gained a reaction!`);
	// The reaction is now also fully available and the properties will be reflected accurately:
	console.log(`${reaction.count} user(s) have given the same reaction to this message!`);
});



client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
/*
	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!');
		await wait(2_000);
    //await interaction.followUp('Pong again!'); optional
		await interaction.editReply('Pong again!');
   //await interaction.followUp({ content: 'Pong again!', ephemeral: true }); optional 2`
//await interaction.deleteReply(); delete message optional


	}

	}*/



//message reply
/*
client.on(Events.InteractionCreate, interaction => {
	const locales = {
		pl: 'Witaj Świecie!',
		de: 'Hallo Welt!',
	};
	interaction.reply(locales[interaction.locale] ?? 'Hello World (default is english)');
});
*/
	const command = client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	const { cooldowns } = interaction.client;

	if (!cooldowns.has(command.data.name)) {
		cooldowns.set(command.data.name, new Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.data.name);
	const defaultCooldownDuration = 3;
	const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;

	if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

		if (now < expirationTime) {
			const expiredTimestamp = Math.round(expirationTime / 1000);
			return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});






let status = [
  {
    name: "Rakan Aditya",
    type: ActivityType.Streaming,
    url: 'https://www.twitch.tv/rakanaditya',
  },
  {
    name: "Rakan Aditya Nonton Anime",
    type: ActivityType.Watching,
  },
  {
    name: "Rakan Aditya Playing Ngoding 2024",
    type: ActivityType.Playing,
  },
  {
    name: "Rakan Aditya Listening Music Spotify",
    type: ActivityType.Listening,
  },
]


//status playing activities
client.on('ready', (c) => {
    console.log(`${c.user.username} is online acitivity.`);

    setInterval(() => {
    let random = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[random]);
}, 10000);
});


client.on('messageCreate', (message) => {
   if (message.author.bot) {
    return;
}

  if (message.content === 'hello'){
     message.reply('hello')
}
});


client.on('guildMemberAdd', member => {
    const channel = member.guild.channels.cache.find(channel => channel.id === '827193058956804167'); // Change 'welcome/generals' to the name of your welcome channel
    if (!channel) return;
    
    channel.send(`Welcome to the server, ${member}!`);
});

 
(async () => {
  try {
  //  mongoose.set('strictQuery', false);
  //  await mongoose.connect(mongodb);
//    await mongoose.connect(mongodb, { keepAlive: true });

  //  console.log('Connected to DB.');

   // Log in to Discord with your client's token
client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();
