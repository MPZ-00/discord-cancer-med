const mongoose = require('mongoose');
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { Boost } = require('../../../../tools/schema.js');
const { std_no_Admin_response, is_Admin, getLevel, levelUp, has_Admin_Permission, create_embed, get_App_Dir } = require('../../../../tools/functions.js');
const prefix = process.env.PREFIX;
const moment = require('moment');
const MAX_DAILY_USES = 1;
const message = context.params.event
let subcommand = message.data.options[0] || {name: 'daily', value: 'none'}

console.log(`${message.member.user.username} just triggered the /ls-daily ${subcommand.name} command!`);
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/ls-daily ${subcommand.name}** command!`
});

console.log('subcommand:', subcommand)
console.log('get App Dir:', get_App_Dir())

/* Get user */
const user = await lib.discord.guilds['@0.1.2'].members.retrieve({
  user_id: (subcommand.options && subcommand.options[0] !== undefined ? subcommand.options[0].value : false) || message.member.user.id,
  guild_id: message.guild_id
}).then(res => {
  return res.user;
}).catch(err => {
  return message.member.user
})
const daily = await getUser(user.id, message.guild_id)

switch (subcommand.name) {
  case 'daily':
    return await add_Daily(message, user.id)
  case 'reset':
    return await Reset(message, user.id)
  default:
    return await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${message.channel_id}`,
      content: `ups, something went wrong!\nCommand: ${subcommand.name} was not found!`
    });
}

return;
async function no_Admin_Perms(command) {
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${message.channel_id}`,
    content: `**<@${message.member.user.id}> - You need the ADMINISTRATOR permission to use the ${command} command!**`,
  });
}

async function getUser(userId, guildId) {
  if(!mongoose.connection.readyState) await mongoose.connect(process.env.MONGO_URL)
  
  const boost = await Boost.findOne({userId, guildId})
  if (!boost) {
    return new Boost({
      guildId,
      userId,
    })
  }
  return boost
}

async function add_Daily(message, userId) {
  const daily = await getUser(userId, message.guild_id)
  
  let difference_in_time = Date.now() - new Date(daily.daily_last_used)
  let difference_in_days = difference_in_time / (1000 * 3600 * 24)
  console.log(`Difference in time: ${difference_in_time}, in days: ${difference_in_days}`)
  
  if (difference_in_days >= 1) {
    console.log(`Difference in time exceeds 24 hours, resetting!`)
    daily.daily_used = 0
    await daily.save()
  }
  
  if (daily.daily_used < MAX_DAILY_USES && difference_in_days >= 1) {
    daily.daily_used++
    daily.daily_last_used = Date.now()
    await daily.save()
    await add_Xp(message)
    await daily_Up(message, daily, userId)
  } else {
    // last used > 24 hours ago?
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${message.channel_id}`,
      content: `🕛 <@${message.member.user.id}>, ${message.member.roles.includes(process.env.LANGUAGE_GERMAN) ? 'Du musst mindestens 24 Stunden warten, bevor du diesen Befehl wieder verwenden kannst!' : 'you have to wait at least 24 hours before you can use this command again!'}`
    });
  }
  
  await daily.save();
  return daily;
}

async function daily_Up(message, daily, userId) {
  await lib.discord.channels['@0.2.2'].messages.create({
    content: `<@${userId}> 🎉, You just used daily! **${daily.daily_used}**/${MAX_DAILY_USES}!`,
    channel_id: message.channel_id,
    /*message_reference: {
      message_id: message.id
    }*/
  });
}

async function Reset(message, userId) {
  if (!is_Admin(message)) {
    return await std_no_Admin_response(prefix, 'Reset')
  }
  const daily = await getUser(userId, message.guild_id)
  daily.daily_used = 0
  daily.daily_last_used = new Date(0)
  await daily.save()
  await lib.discord.channels['@0.2.2'].messages.create({
    content: `<@${userId}>, You have ${daily.daily_used}/${MAX_DAILY_USES} dailys left! Last used: ${daily.daily_last_used}`,
    channel_id: message.channel_id
  })
}

async function add_Xp(message) {
  const xpChange = getRandomInt(process.env.XP_MAX_VALUE * 10, process.env.XP_MIN_VALUE * 10); //Get random integer between the range of 4 to 1
  const level = await getLevel(message.member.user.id, message.guild_id); // Get level of the user
  level.xp = level.xp + xpChange; //add new xp to current XP
  level.message_count++; //Increase message count by 1
  
/* If user reaches new level */
  if (level.xp >= (level.level * level.level * 100)) {
    level.level++
    await levelUp(message, level);
  }

  await level.save();
  return level;
}

/**
 * Get random integer between given range
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}