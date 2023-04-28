const mongoose = require('mongoose');
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { Leveling } = require('./schema.js');
const prefix = process.env.PREFIX;
const moment = require('moment');

async function addXp(message) {
  const xpChange = getRandomInt(process.env.XP_MAX_VALUE, process.env.XP_MIN_VALUE); //Get random integer between the range of 4 to 1
  const level = await getLevel(message.author.id, message.guild_id); // Get level of the user
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
 * Function to get user level data
 */
async function getLevel(userId, guildId) {
  if(!mongoose.connection.readyState) await mongoose.connect(process.env.MONGO_URL);

  const level = await Leveling.findOne({userId, guildId});
  if (!level)
    return new Leveling({
      guildId,
      userId,
    });

  return level;
}

/**
 * Function to send level up message to the channel
 */
async function levelUp(message, level) {
  await lib.discord.channels['@0.2.2'].messages.create({
    content: `<@${message.author.id}> 🎉 Congratulations, You just leveled up to **${level.level}**!`,
    channel_id: message.channel_id,
  });
}

/**
 * Get random integer between given range
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function change(num) {
  if (!num) return "NaN";
  if (typeof num === "string") num = parseInt(num);
  let decPlaces = Math.pow(10, 1);
  var abbrev = ["K", "M", "B", "T"];
  for (var i = abbrev.length - 1; i >= 0; i--) {
    var size = Math.pow(10, (i + 1) * 3);
    if (size <= num) {
      num = Math.round((num * decPlaces) / size) / decPlaces;
      if (num == 1000 && i < abbrev.length - 1) {
        num = 1;
        i++;
      }
      num += abbrev[i];
      break;
    }
  }
  return num;
}

/**
 * Get top users according to given value from database
 */
async function getTopUsers(guildId, type) {
  if(!mongoose.connection.readyState) await mongoose.connect(process.env.MONGO_URL);
  let users = await Leveling.find({
    guildId
  })
  
  users = users.sort((a, b) => a[type] < b[type] ? 1 : b[type] < a[type]? -1 : 0)
  return users;
}

/**
 * Get rank of a particular user
 */
async function getRank(userId, guildId, type) {
  const topMembers = await getTopUsers(guildId, type)
  const indexNumber = topMembers.indexOf(topMembers.find(x => x.userId === userId))
  return indexNumber + 1;
}

/**
 * Get user avatar
 */
function getAvatar(user) {
    if(!user.avatar) {
      return `https://cdn.discordapp.com/embed/avatars/${(user.discriminator % 5)}.png`
    } else {
      return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.jpg`
    }
}

function convertIDtoUnix(id) { // Copyright (c) 2019 Hugonun(https://github.com/hugonun)
  /* Note: id has to be str */
  var bin = (+id).toString(2);
  var unixbin = '';
  var unix = '';
  var m = 64 - bin.length;
  unixbin = bin.substring(0, 42-m);
  unix = parseInt(unixbin, 2) + 1420070400000;
  return unix;
}

function convert(id) {
  const moment = require('moment');
  var unix = convertIDtoUnix(id.toString());
  var timestamp = moment.unix(unix/1000);
  return {
    i_dateDE: timestamp.format('DD-MM-YYYY'),
    i_date24: timestamp.format('DD-MM-YYYY, HH:mm:ss'),
    i_date12: timestamp.format('YYYY-MM-DD, h:mm:ss A'),
    i_timeago: timestamp.fromNow(),
    i_timestamp: unix
  }
}

async function addXp_boost(message, args) {
  args = [args]
  if (!args) {args = 30}
  const multiplier = args[0]
  const xpChange = getRandomInt(process.env.XP_MAX_VALUE, process.env.XP_MIN_VALUE); //Get random integer between the range of *(30|args) to *(30|args)
  const level = await getLevel(message.author.id, message.guild_id); // Get level of the user
  level.xp = level.xp + (xpChange * multiplier); //add new xp to current XP times multiplier
  level.message_count++; //Increase message count by 1
  
  console.log(`Success! + ${xpChange * multiplier} | (${xpChange} * ${multiplier})`)
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: message.channel_id,
    content: `Success! + ${xpChange * multiplier} | (${xpChange} * ${multiplier})`,
    message_reference: {
      message_id: message.id,
      fail_if_not_exists: true
    }
  })
  
/* If user reaches new level */
  if (level.xp >= (level.level * level.level * 100)) {
    level.level++
    await levelUp(message, level);
  }

  await level.save();
  return level;
}


async function is_Admin(message) {
  return message.member.roles.includes(process.env.ROLE_ADMIN)
}

async function has_Admin_Permission(message) {
  return message.member.permission_names.includes('ADMINISTRATOR')
}

async function std_no_Admin_response(prefix, cmd) {
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: context.params.event.channel_id,
    content: `You need to be an Admin to use the ${prefix}${cmd} command`,
    message_reference: {
      message_id: context.params.event.id
    }
  })
}

function data_options_value(options) {
  let value = '0000000000000000'
  if (options && options[0] && options[0].options && options[0].options[0] && options[0].options[0].value) {
    value = options[0].options[0].value
  }
  if (!process.env.IS_DEBUG) {
    return value
  }
  
  console.group('data-options:')
  if (options) {
    console.log('options', options)
    if (options[0]) {
      console.log('options[0]', options[0])
      if (options[0].options) {
        console.log('options[0].options', options[0].options)
        if (options[0].options[0]) {
          console.log('options[0].options[0]', options[0].options[0])
          if (options[0].options[0].value) {
            console.log('options[0].options[0].value', options[0].options[0].value)
            val = options[0].options[0].value
          }
        }
      }
    }
  }
  console.groupEnd()
  return value
}

async function create_embed(channel_id, content, title, embed_content, color) {
  let msg = await lib.discord.channels['@0.2.2'].messages.create({
    channel_id: channel_id,
    content: `${content}`,
    embed: {
      type: 'rich',
      title: `${title}`,
      description: `${embed_content}`,
      color: `${color}`
    }
  })
  console.log(msg.embeds[0])
}

async function get_App_Dir() {
  const {dirname} = require('path')
  const {constants, promises: {access}} = require('fs')
  
  for (let path of module.paths) {
    try {
      await access(path, constants.F_OK)
      return dirname(path)
    } catch (e) {console.error(e)}
  }
}

module.exports = {addXp, getLevel, change, getAvatar, getRank, getTopUsers, convertIDtoUnix, convert, addXp_boost, levelUp, is_Admin, std_no_Admin_response, data_options_value, has_Admin_Permission, create_embed, get_App_Dir };