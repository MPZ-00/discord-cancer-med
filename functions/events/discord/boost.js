const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `<@!${context.params.event.member.user.id}> used **/boost**`,
});

await lib.discord.interactions['@0.0.0'].followups.create({
  token: context.params.event.token, // required
  content: `<@!${context.params.event.member.user.id}> just triggered the **/boost** command!`, // required
});

// Write some custom code here
console.log(
  `${context.params.event.member.user.username} just triggered the **/boost** command!`
);
console.log('data:', context.params.event.data);
console.log('member:', context.params.event.member);

let followup_retrieve = lib.discord.interactions['@0.0.0'].followups.retrieve({
  token: `${context.params.event.token}`,
  message_id: `${context.params.event.id}`,
});

console.log('followup_retrieve', followup_retrieve);
