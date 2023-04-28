const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

const timeDif = (time1, time0) => time1.getTime() - time0.getTime()
let date0 = new Date();

let msg = await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `Pong! ${context.params.event.member.user.username}`
})

let latency = timeDif(new Date(msg.timestamp), date0)

//console.log(msg)
console.log(msg.timestamp, date0)
console.log('Command: /ping', {Username: `${context.params.event.member.user.username}`, message_id: `${msg.id}`, channel_id: `${msg.channel_id}`, timestamp_0: `${date0}`, timestamp_1: `${msg.timestamp}`, latency: `${latency}`})

let msg2 = await lib.discord.channels['@0.2.2'].messages.update({
  message_id: `${msg.id}`,
  channel_id: `${msg.channel_id}`,
  content: `Pong! <@!${context.params.event.member.user.id}> - Latency: ${latency}ms`
});