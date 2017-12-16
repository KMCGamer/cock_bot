const db = require('../DBController.js');

function enableRole(message, args) {
  // Find the role in the guild
  const role = message.guild.roles.find(elem => elem.name.toLowerCase() === args.toLowerCase());

  // Return if the role doesnt exist.
  if (!role) {
    message.channel.send('Please enter a valid role name.');
    return;
  }

  // Disable the role
  db.removeDisabledRole(message.guild.id, role.name);
  message.channel.send(`"${role.name}" has been enabled.`);
}

module.exports = enableRole;
