const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const message = context.params.event
const { getLevel } = require('../../../../tools/functions.js')

console.log(`${message.member.user.username} just triggered the /ls-blur command!`)
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/ls-blur** command!`
});

let msg = await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: message.channel_id,
  content: `<@!${message.member.user.id}> just triggered the **/ls-blur** command!`
})

// Get user leveling data
const userLevel = await getLevel(message.member.user.id, message.guild_id)
userLevel.blur = !userLevel.blur // Toggle it
await userLevel.save() // Save data

// Success Embed
await lib.discord.channels['@0.2.2'].messages.create({
  content: message.member.roles.includes(process.env.LANGUAGE_GERMAN) ? `✅ | Unschärfe für die Levelkarte ist ${userLevel.blur ? 'Aktiviert' : 'Deaktiviert'}!` : `✅ | ${userLevel.blur ? 'Enabled' : 'Disabled'} blur for leveling card!`,
  channel_id: msg.channel_id,
  message_reference: {
    message_id: msg.id,
    channel_id: msg.channel_id
  }
})