const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN})
const { addXp, updateRank, getRank, getLevel, levelUp } = require('../tools/functions.js')

module.exports = async (context, args) => {
  let msg = await lib.discord.channels['@0.2.2'].messages.create({
    content: `User: ${context.params.event.author.username}`,
    channel_id: context.params.event.channel_id,
    message_reference: {
      message_id: context.params.event.id,
      channel_id: context.params.event.channel_id
    }
  })
  
  /**
   * Get random integer between given range
   */
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  async function addXp_xx(message, id, guild_id, m_count) {
    const xpChange = getRandomInt(process.env.XP_MAX_VALUE * 8, process.env.XP_MIN_VALUE * 8);
    const level = await getLevel(id ? id : message.author.id, guild_id ? guild_id : message.guild_id); // Get level of the user
    level.xp = level.xp + xpChange;             //add new xp to current XP
    level.message_count += m_count ? m_count : 1;
    
  /* If user reaches new level */
    if (level.xp >= (level.level * level.level * 100)) {
      level.level++
      await levelUp(message, level);
    }
  
    await level.save();
    return level;
  }
  
  return addXp_xx(context.params.event, args[0], args[1], args[3]).then(console.log)
} 