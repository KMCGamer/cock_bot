const config = require('./config.json');
const commands = require('./commands/commands.js');
const discord = require('discord.js');
const db = require('./DBController.js');
const _ = require('lodash');

const client = new discord.Client();
const commandsList = commands.map(command => command.name);

// Initialize the database if it is fresh.
db.initDatabase();

// Set the game when bot comes online
client.on('ready', () => {
  console.log('This bot has started.');
  client.user.setGame('Online');
});

// When a guild adds the bot add it to the db
client.on('guildCreate', (guild) => {
  console.log('Added to new server!');
  if (!db.serverExists(guild.id)) {
    db.addServer(guild.id);
    db.addManager(guild.id, guild.ownerID);
  }
});

// Handle all PMs. All PMs should be for verification only (at the moment)


// Handle all messages inside of guilds
client.on('message', (message) => {
  // Do not listen to commands that are made by a bot
  if (message.author.bot) return;

  // Do not listen if the command doesnt start with the specified prefix
  if (message.content.slice(0, config.prefix.length) !== config.prefix) return;

  const command = message.content.split(' ')[0].slice(config.prefix.length);

  // Dont run any commands if its invalid.
  if (!commandsList.includes(command)) {
    message.react('❓');
    message.reply('Please enter a valid command.').then((msg) => {
      msg.delete(10000); // Delete the message ten seconds
    });
    return;
  }

  // +1 for the space after the command
  const args = message.content.slice(config.prefix.length + command.length + 1);

  try {
    const indexOfCommand = _.findIndex(commands, { name: command });
    commands[indexOfCommand].issue(message, args);
  } catch (err) {
    message.react('💢');
    message.channel.send(`The bot ran into an unexpected error. Fix this shit: ${err.message}`);
  }
});

client.login(config.token);
