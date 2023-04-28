module.exports = {
  commands: ['status-update', 'su'],
  expectedArgs: '<activity_name> <activity_type> <url> <status>',
  permissionError: 'You need admin permissions to run this command',
  minArgs: 1,
  maxArgs: 4,
  callback: (message, arguments, text) => {
    // TODO: Add funktionality
  },
  permissions: ['ADMINISTRATOR'],
  requiredRoles: [],
}