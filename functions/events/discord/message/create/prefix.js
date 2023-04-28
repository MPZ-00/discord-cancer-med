// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const prefix = process.env.PREFIX;
const message = context.params.event;
const germanLanguage = '908823242020626532'
//const { commandOptions, validatePermissions } = require('../../../../../commands/test/prefix_export.js')

const validatePermissions = (permissions) => {
  const validPermissions = [
    'CREATE_INSTANT_INVITE',
    'KICK_MEMBERS',
    'BAN_MEMBERS',
    'ADMINISTRATOR',
    'MANAGE_CHANNELS',
    'MANAGE_GUILD',
    'ADD_REACTIONS',
    'VIEW_AUDIT_LOG',
    'PRIORITY_SPEAKER',
    'STREAM',
    'VIEW_CHANNEL',
    'SEND_MESSAGES',
    'SEND_TTS_MESSAGES',
    'MANAGE_MESSAGES',
    'EMBED_LINKS',
    'ATTACH_FILES',
    'READ_MESSAGE_HISTORY',
    'MENTION_EVERYONE',
    'USE_EXTERNAL_EMOJIS',
    'VIEW_GUILD_INSIGHTS',
    'CONNECT',
    'SPEAK',
    'MUTE_MEMBERS',
    'DEAFEN_MEMBERS',
    'MOVE_MEMBERS',
    'USE_VAD',
    'CHANGE_NICKNAME',
    'MANAGE_NICKNAMES',
    'MANAGE_ROLES',
    'MANAGE_WEBHOOKS',
    'MANAGE_EMOJIS_AND_STICKERS',
    'USE_APPLICATION_COMMANDS',
    'REQUEST_TO_SPEAK',
    'MANAGE_EVENTS',
    'MANAGE_THREADS',
    'CREATE_PUBLIC_THREADS',
    'CREATE_PRIVATE_THREADS',
    'USE_EXTERNAL_STICKERS',
    'SEND_MESSAGES_IN_THREADS',
    'START_EMBEDDED_ACTIVITIES'
  ]
  
  for (const permission of permissions) {
    if (!validPermissions.includes(permission)) {
      throw new Error(`Unknown permission node "${permission}"`)
    }
  }
}

let commandOptions = {
  commands: [],
  expectedArgs: '',
  permissionError: 'You do not have permission to run this command.',
  minArgs: 0,
  maxArgs: null,
  permissions: [],
  requiredRoles: [],
  callback: function () {}
}

// Ensure the command and aliases are in an array
if (typeof commands === 'string') {
  commands = [commands]
}

// Ensure the permissions are in an array and are all vaild
if (commandOptions.permissions.length) {
  if (typeof permissions === 'string') {
    permissions = [permissions]
  }

  validPermissions(permissions)
}

// Listen for messages
const {member, content, guild_id} = context.params.event;

console.log('commandOptions:', commandOptions)

for (const alias of commandOptions.commands) {
  if (content.toLowerCase().startsWith(`${prefix}${alias.toLowerCase()}`)) {// A command has been ran
    // Ensure the user has the required permissions
    for (const permission of permissions) {
      if (!member.hasPermission(permission)) {
        lib.discord.channels['@0.2.2'].messages.create({
          channel_id: `${event.channel_id}`,
          content: `${member.roles.includes(germanLanguage) ? 'Ihre Berechtigungen sind zu niedrig, um diesen Befehl auszuführen.' : 'Your permissions are to low, to run this command.'}`,
          message_reference: {
            message_id: message.id
          }
        })
      }
    }

    // Ensure the user has the required roles
    for (const requiredRole of requiredRoles) {
      const _role = guild.roles.cache.find(role => role.name === requiredRole)
      const role = lib.discord.guilds['@0.1.3'].roles.list({
        guild_id: `${context.params.event.guild_id}`
      });
      console.log('_role', _role)
      console.log('role', role)

      if (!role || member.roles.includes(role.id)) {
        lib.discord.channels['@0.2.2'].messages.create({
          channel_id: event.channel_id,
          content: member.roles.includes(germanLanguage) ? `Sie müssen die Rolle "${requiredRole}" haben, um diesen Befehl zu verwenden.` : `You must have the "${requiredRole}" role to user this command.`,
          message_reference: {
            message_id: message.id
          }
        })
      }
    }
    return
  }
}

// Split on any number of spaces
const arguments = content.split(/[ ]+/)

// Remove the command wich is the first index
arguments.shift()

// Ensure we have the corerct number of arguments
if (arguments.length < commandOptions.minArgs || (commandOptions.maxArgs !== null && arguments.length > commandOptions.maxArgs)) {
  lib.discord.channels['@0.2.2'].messages.create({
    channel_id: event.channel_id,
    content: member.roles.includes(germanLanguage) ? `Falsche Syntax! Verwenden Sie ${prefix}${alias} ${commandOptions.expectedArgs}` : `Incorrect syntax! Use ${prefix}${alias} ${commandOptions.expectedArgs}`,
    message_reference: {
      message_id: message.id
    }
  })
  return
}

// Handle the custom command code
commandOptions.callback(message, arguments, arguments.join(' '))
return