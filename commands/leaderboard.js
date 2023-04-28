const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN})
const { getTopUsers } = require('../tools/functions.js')

module.exports = async (context, args) => {
  // Extract value for easy access
  const {guild_id, id, channel_id} = context.params.event
  
  // Fetch server details
  const serverDetails = await lib.discord.guilds['@0.1.3'].retrieve({
    guild_id: guild_id
  })
  
  // Get top Members of the guild and get first top 10 from them
  const topMembers = await getTopUsers(guild_id, 'xp').then((members) => {
    return members?.slice(0, 10) || []
  })
  
  // Send the list of members in cool looking embed
  await lib.discord.channels['@0.2.2'].messages.create({
    content: ``,
    channel_id,
    embed: {
      title: `${serverDetails.name}'s top Members`,
      color: 0xffffff,
      thumbnail: {
        url: `https://cdn.discordapp.com/icons/${guild_id}/${serverDetails.icon}`
      },
      description: topMembers.map((x, i) => {
        return `[ ${i + 1} ] : ${!i ? '👑' : ''} <@${x.userId}> => \`${x.xp} xp\` | \`${x.message_count} messages\``
      }).join('\n')
    },
    message_reference: {
      message_id: id,
      channel_id
    }
  });
}