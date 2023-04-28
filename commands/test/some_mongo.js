const mongoose = require('mongoose');
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { Boost } = require('./schema.js');
const prefix = process.env.PREFIX;
const moment = require('moment');

module.exports = async (context, args) => {
  const ID = context.params.event.mentions[0] ? context.params.event.mentions[0].id : context.params.event.author.id
  const member = await lib.discord.guilds['@0.1.3'].members.retrieve({
    user_id: ID,
    guild_id: context.params.event.guild_id
  })
  
  console.log(getUser(member.user.id, context.params.event.guild_id).then(console.log))
  
  let msg = await lib.discord.channels['@0.2.2'].messages.create({
    content: `User: ${member.user.username}`,
    channel_id: context.params.event.channel_id,
    message_reference: {
      message_id: context.params.event.id,
      channel_id: context.params.event.channel_id
    }
  })
}

async function getUser(userId, guildId) {
  if(!mongoose.connection.readyState) await mongoose.connect(process.env.MONGO_URL_1)
  
  const boost = await Boost.findOne({userId, guildId})
  if (!boost) {
    return new Boost({
      guildId,
      userId,
    })
  }
  
  return boost
}