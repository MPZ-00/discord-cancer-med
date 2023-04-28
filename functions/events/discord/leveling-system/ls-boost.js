const mongoose = require('mongoose');
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { Boost } = require('../../../../tools/schema.js');
const { std_no_Admin_response, is_Admin, getLevel, levelUp, has_Admin_Permission, create_embed } = require('../../../../tools/functions.js');
const prefix = process.env.PREFIX;
const moment = require('moment');
const MAX_BOOST_USES = 2;
const message = context.params.event
let subcommand = message.data.options[0]

console.log(`${message.member.user.username} just triggered the /ls-boost ${subcommand.name} command!`);
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/ls-boost ${subcommand.name}** command!`
});

console.log('subcommand:', subcommand)

/* Get user */
const user = await lib.discord.guilds['@0.1.2'].members.retrieve({
  user_id: (subcommand.options && subcommand.options[0] !== undefined ? subcommand.options[0].value : false) || message.member.user.id,
  guild_id: message.guild_id
}).then(res => {
  return res.user;
}).catch(err => {
  return message.member.user
})
const boost = await getUser(user.id, message.guild_id)
//console.log('boost:', boost);

/*// old
if (subcommand && subcommand.name === 'boost') {
  let aB = await addBoost(message, user.id)
  console.log('boost - addBoost:', aB)
  return
}

if (subcommand.name === 'left') {
  return await boost_Left(message, user.id)
}
if (subcommand.name === 'reset') {
  return await boost_Reset(message, user.id)
}
if (subcommand.name === 'resettime') {
  return await boost_Reset_Time(message, user.id)
}
*/

switch (subcommand.name) {
  case 'boost':
    return await addBoost(message, user.id)
  case 'left':
    return await boost_Left(message, user.id)
  case 'reset':
    return await boost_Reset(message, user.id)
  case 'reset-time':
    if (!has_Admin_Permission(message)) {return no_Admin_Perms(subcommand.name)}
    return await boost_Reset_Time(message, user.id)
  case 'reset-count':
    if (!has_Admin_Permission(message)) {return no_Admin_Perms(subcommand.name)}
    return await boost_Reset_Count(message, user.id)
  case 'set-last_used':
    if (!has_Admin_Permission(message)) {return no_Admin_Perms(subcommand.name)}
    return await boost_Set_Last_Used(message, user.id)
  case 'set-count':
    if (!has_Admin_Permission(message)) {return no_Admin_Perms(subcommand.name)}
    return await boost_Set_Count(message, user.id)
  case 'get-time_count':
    if (!has_Admin_Permission(message)) {return no_Admin_Perms(subcommand.name)}
    return await boost_Get_Time_Count(message, user.id)
  default:
    return await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${message.channel_id}`,
      content: `ups, something went wrong!\nCommand: ${subcommand.name} was not found!`
    });
}

return;
async function no_Admin_Perms(command) {
  let msg_content = [
    `**<@${message.member.user.id}> - You need the ADMINISTRATOR permission to use the ${command} command!**`,
    `**<@${message.member.user.id}> - Du benötigst die ADMINISTRATOR Berechtigung um ${command} Befehl zu verwenden!**`
  ]
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${message.channel_id}`,
    content: msg_content[message.member.roles.includes(process.env.LANGUAGE_GERMAN) ? 1:0],
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

async function addBoost(message, userId) {
  const boost = await getUser(userId, message.guild_id)
  
  let difference_in_time = Date.now() - new Date(boost.boost_last_used)
  let difference_in_days = difference_in_time / (1000 * 3600 * 24)
  console.log(`Difference in time: ${difference_in_time}, in days: ${difference_in_days}`)
  
  let ttw = new Date(boost.boost_last_used)
  console.log(`Time to wait: (now - last used - 12h`)
  console.log(ttw)
  console.log(`12 - (new Date(Date.now()).getHours() - new Date(ttw).getHours())`, 12 - (new Date(Date.now()).getHours() - new Date(ttw).getHours()))
  
  if (difference_in_days >= 1) {
    console.log(`Difference in time exceeds 24 hours, resetting!`)
    boost.boost_uses = 0
    await boost.save()
  }
  
  let msg_content = [
    `🕛 <@${message.member.user.id}>, You have to wait at least ${new Date(boost.boost_last_used).getHours()} hours and ${new Date(boost.boost_last_used).getMinutes()} minutes before you can use this command again!`,
    `🕛 <@${message.member.user.id}>, Du musst mindestens ${new Date(boost.boost_last_used).getHours()} Stunden und ${new Date(boost.boost_last_used).getMinutes()} Minuten warten, bevor du diesen Befehl wieder verwenden kannst!`
  ]
  if (boost.boost_uses < MAX_BOOST_USES && difference_in_days >= 0.5) {
    boost.boost_uses = boost.boost_uses + 1
    boost.boost_last_used = Date.now()
    await boost.save()
    await boost_addXp(message)
    await boost_Up(message, boost, userId)
  } else {
    // last used > 24 hours ago?
    await lib.discord.channels['@0.3.0'].messages.create({
      channel_id: `${message.channel_id}`,
      content: msg_content[message.member.roles.includes(process.env.LANGUAGE_GERMAN) ? 1:0]
    });
  }
  
  /*if (difference_in_days >= 1) { // Achtung: erst noch boost aktualisieren!
    console.log('now: reset boost_uses and try again')
    boost.boost_uses = 0
    await boost.save()
    addBoost(message, userId)
  }*/
  
  await boost.save();
  return boost;
}

async function boost_Up(message, boost, userId) {
  //console.log('boost_Up(boost)', boost)
  let msg_content = [
    `<@${userId}> 🎉, You just used a boost! **${boost.boost_uses}**/${MAX_BOOST_USES}!`,
    `<@${userId}> 🎉, Du hast einen Boost verwendet! **${boost.boost_uses}**/${MAX_BOOST_USES}!`
  ]
  await lib.discord.channels['@0.2.2'].messages.create({
    content: msg_content[message.member.roles.includes(process.env.LANGUAGE_GERMAN) ? 1:0],
    channel_id: message.channel_id,
    /*message_reference: {
      message_id: message.id
    }*/
  });
}

async function boost_Left(message, userId) {
  const boost = await getUser(userId, message.guild_id)
  let msg_content = [
    `<@${userId}>, You have used ${boost.boost_uses}/${MAX_BOOST_USES} boosts today!`,
    `<@${userId}>, Du hast heute ${boost.boost_uses}/${MAX_BOOST_USES} boosts verwendet!`
  ]
  await lib.discord.channels['@0.2.2'].messages.create({
    content: msg_content[message.member.roles.includes(process.env.LANGUAGE_GERMAN) ? 1:0],
    channel_id: message.channel_id,
    /*message_reference: {
      message_id: message.id
    }*/
  })
}

async function boost_Reset(message, userId) {
  if (!is_Admin(message)) {
    return await std_no_Admin_response(prefix, 'boost reset')
  }
  const boost = await getUser(userId, message.guild_id)
  boost.boost_uses = 0
  boost.boost_last_used = new Date(0)
  await boost.save()
  let msg_content = [
    `<@${userId}>, 'You have ${boost.boost_uses}/${MAX_BOOST_USES} boosts left! Last used: ${boost.boost_last_used}`,
    `<@${userId}>, 'Du hast ${boost.boost_uses}/${MAX_BOOST_USES} boosts übrig! Zuletzt verwendet: ${boost.boost_last_used}`
  ]
  
  await lib.discord.channels['@0.2.2'].messages.create({
    content: msg_content[message.member.roles.includes(process.env.LANGUAGE_GERMAN) ? 1:0],
    channel_id: message.channel_id,
    /*message_reference: {
      message_id: message.id
    }*/
  })
}

async function boost_Reset_Time(message, userId) {
  if (!is_Admin(message)) {
    return await std_no_Admin_response(prefix, 'boost reset time')
  }
  
  const boost = await getUser(userId, message.guild_id)
  boost.boost_last_used = new Date(0)
  await boost.save()
  
  let msg_content = [
    `<@${userId}>, You have ${boost.boost_uses}/${MAX_BOOST_USES} boosts left! Last used: ${boost.boost_last_used}`,
    `<@${userId}>, Du hast ${boost.boost_uses}/${MAX_BOOST_USES} boosts übrig! Zuletzt verwendet: ${boost.boost_last_used}`
  ]
  await lib.discord.channels['@0.2.2'].messages.create({
    content: msg_content[message.member.roles.includes(process.env.LANGUAGE_GERMAN) ? 1:0],
    channel_id: message.channel_id
  })
}

async function boost_Time_Set(message, userId) {
  const boost = await getUser(userId, message.guild_id)
  let msg_content = [
    `<@${userId}>, You have ${boost.boost_uses}/${MAX_BOOST_USES} boosts left! Last used: ${boost.boost_last_used}`,
    `<@${userId}>, Du hast ${boost.boost_uses}/${MAX_BOOST_USES} boosts übrig! Zuletzt verwendet: ${boost.boost_last_used}`
  ]
  await lib.discord.channels['@0.2.2'].messages.create({
    content: msg_content[message.member.roles.includes(process.env.LANGUAGE_GERMAN) ? 1:0],
    channel_id: message.channel_id
  })
  
}

async function boost_Set_Last_Used(message, userId) {
  const boost = await getUser(userId, message.guild_id)
  console.log(`boost_Set_Last_Used()`)
  const currentDate = new Date()
  
  let blu = new Date(`'${boost.boost_last_used}'`)
  let set_date = {year: currentDate.getFullYear(), month: currentDate.getMonth(), day: currentDate.getDate(), hour: 0, minute: 0, seconds: 0}
  set_date.hour = subcommand.options.find(x => x.name === 'hour').value
  set_date.minute = subcommand.options.find(x => x.name === 'minute').value
  set_date.seconds = subcommand.options.find(x => x.name === 'seconds').value
  set_date.year = subcommand.options.find(x => x.name === 'year').value
  set_date.month = subcommand.options.find(x => x.name === 'month').value
  set_date.day = subcommand.options.find(x => x.name === 'day').value
  console.log('set_date:', set_date)
  
  await create_embed(
    message.channel_id,
    ``,
    'Boost Set: Last Used',
    [
      `User: <@${userId}>`,
      `Date: ${boost.boost_last_used}`,
      `time: ${blu.getHours()}:${blu.getMinutes()}:${blu.getSeconds()} - old`,
      `time: ${set_date.hour}:${set_date.minute}:${set_date.seconds} - new`
    ].join('\n'),
    131644
  )
  
  //console.log(Date.parse(new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), set_date.hour, set_date.minute, set_date.seconds)))
  
  console.log('currentDate:', currentDate)
  //const datetime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), set_date.hour, set_date.minute, set_date.seconds)
  const datetime = new Date(set_date.year, set_date.month, set_date.day, set_date.hour, set_date.minute, set_date.seconds)
  console.log('datetime:', datetime)
  console.log('parse(datetime):', Date.parse(datetime))
  console.log('Date.now():', Date.now())
  
  let parsed_datetime = new Date(Date.parse(datetime))
  console.log('parsed datetime to new date:', parsed_datetime)
  
  boost.boost_last_used = parsed_datetime
  await boost.save()
  
  await boost_Get_Time(message, userId)
}

async function boost_Set_Count(message, userId) {
  await boost_Get_Count(message, userId)
  const boost = await getUser(userId, message.guild_id)
  boost.boost_uses = subcommand.options[0].value
  await boost.save()
  await boost_Get_Count(message, userId)
}

async function boost_Get_Time_Count(message, userId) {
  await boost_Get_Time(message, userId)
  await boost_Get_Count(message, userId)
}
async function boost_Get_Time(message, userId) {
  const boost = await getUser(userId, message.guild_id)
  await create_embed(
    message.channel_id,
    ``,
    'Boost Get: Last Used',
    [
      `User: <@${userId}>`,
      `Date: ${new Date(boost.boost_last_used).toLocaleString()}`,
      `Date (milliseconds): ${Date.parse(new Date(boost.boost_last_used))}`
    ].join('\n'),
    131644
  )
}
async function boost_Get_Count(message, userId) {
  const boost = await getUser(userId, message.guild_id)
  await create_embed(
    message.channel_id,
    ``,
    'Boost Get: Count',
    `User: <@${userId}>\nCount: ${boost.boost_uses}/${MAX_BOOST_USES}`,
    131644
  )
}

async function boost_addXp(message) {
  const xpChange = getRandomInt(process.env.XP_MAX_VALUE * 10, process.env.XP_MIN_VALUE * 10); //Get random integer between the range of 4 to 1
  const level = await getLevel(message.member.user.id, message.guild_id); // Get level of the user
  level.xp = level.xp + xpChange; //add new xp to current XP
  level.message_count++; //Increase message count by 1
  
/* If user reaches new level */
  if (level.xp >= (level.level * level.level * 100)) {
    level.level++
    await level.save()
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