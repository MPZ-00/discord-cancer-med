const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

console.log(`${context.params.event.member.user.username} just triggered the /help command!`)
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${context.params.event.member.user.id}> just triggered the **/help** command!`
});

/* Embed with all commands details */
return lib.discord.channels['@0.2.2'].messages.create({
  content: `Enter '/ls-help' for the Leveling System Help or enter '${process.env.PREFIX}help' for direct bot-help`,
  channel_id: context.params.event.channel_id
});