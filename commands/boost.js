/*
when checking, remove every entry that is more than a day ago, 
then check the count. if count < limit allowed, add the current Date to the array and execute the command
~ Drenius
*/
const mongoose = require('mongoose');
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { Boost } = require('../tools/schema.js');
const { std_no_Admin_response, is_Admin } = require('../tools/functions.js');
const prefix = process.env.PREFIX;
const moment = require('moment');
const MAX_BOOST_USES = 2;

module.exports = async (context, args) => {
  /* Get user */
  const user = await lib.discord.guilds['@0.1.2'].members.retrieve({
    user_id: (context.params.event.mentions && context.params.event.mentions[0] ? context.params.event.mentions[0].id : false) || context.params.event.author.id || args[0]?.match(/\d+/g)[0],
    guild_id: context.params.event.guild_id
  }).then(res => {
    return res.user;
  }).catch(err => {
    return context.params.event.author
  })
  const boost = await getUser(user.id, context.params.event.guild_id)
  
  if (args[0] == 'left') {
    await boost_Left(context.params.event, boost)
    return
  } else if (args[0] == 'reset') {
    await boost_Reset(context.params.event, boost)
    return
  }
  
  //console.log('user:', user)
  //console.log('boost:', boost)
  
  let aB = await addBoost(context.params.event, user.id)
  console.log('boost - aB:', aB)
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
  
  if (boost.boost_uses < MAX_BOOST_USES) {
    boost.boost_uses++
    boost.boost_last_used = Date.now()
    await boost.save()
    await boost_Up(message, boost.boost_uses)
  } else {
    // last used > 24 hours ago?
  }
  let difference_in_time = Date.now() - new Date(boost.boost_last_used)
  let difference_in_days = difference_in_time / (1000 * 3600 * 24)
  console.log(`Difference in time: ${difference_in_time}, in days: ${difference_in_days}`)
  
  if (difference_in_days >= 1) {
    console.log('now: reset boost_uses and try again')
  }
  
  await boost.save();
  return boost;
}

async function boost_Up(message, uses) {
  await lib.discord.channels['@0.2.2'].messages.create({
    content: `<@${message.author.id}> 🎉, You just used a boost! **${uses}**/${MAX_BOOST_USES}!`,
    channel_id: message.channel_id,
    message_reference: {
      message_id: message.id
    }
  });
}

async function boost_Left(message, boost) {
  await lib.discord.channels['@0.2.2'].messages.create({
    content: `<@${(message.mentions && message.mentions[0] ? message.mentions[0].id : false) || message.author.id}>, You have used ${boost.boost_uses}/${MAX_BOOST_USES} boosts today!`,
    channel_id: message.channel_id,
    message_reference: {
      message_id: message.id
    }
  })
}

async function boost_Reset(message) {
  if (!is_Admin(message)) {
    await std_no_Admin_response(prefix, 'boost reset')
    return
  }
  
  const boost = await getUser(message.mentions[0].id || message.author.id, message.guild_id)
  boost.boost_uses = 0
  await boost.save()
  await lib.discord.channels['@0.2.2'].messages.create({
    content: `<@${message.mentions[0].id || message.author.id}>, You have ${boost.boost_uses}/${MAX_BOOST_USES} boosts left!`,
    channel_id: message.channel_id,
    message_reference: {
      message_id: message.id
    }
  })
}