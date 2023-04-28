const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN})
const { getLevel } = require('../tools/functions.js')

module.exports = async (context) => {
  // extract values for easy access
  const { guild_id, channel_id, author, id } = context.params.event
  
  // Get user leveling data
  const userLevel = await getLevel(author.id, guild_id)
  userLevel.blur = !userLevel.blur // Toggle it
  await userLevel.save() // Save data
  
  // Success Embed
  await lib.discord.channels['@0.2.2'].messages.create({
    content: `✅ | ${userLevel.blur ? 'Enabled' : 'Disabled'} blur for leveling card!`,
    channel_id,
    message_reference: {
      message_id: id,
      channel_id
    }
  });
}