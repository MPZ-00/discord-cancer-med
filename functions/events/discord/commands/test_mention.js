const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

let who_executed = await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `<@!${context.params.event.member.user.id}> just triggered the **/test_mention** command!`
})

// Write some custom code here
console.log(context.params.event.data)

lib.discord.channels['@0.2.2'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: [
    `${context.params.event.data.options[0]}`
  ].join('\n'),
  message_reference: {
    'message_id': `${who_executed.id}`
  }
})