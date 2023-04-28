// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const path = require('path');
const prefix = process.env.PREFIX;
const message = context.params.event
//let subcommand = message.data.options[0] || {name: 'daily', value: 'none'}

console.log(`${message.member.user.username} just triggered the /test-path command!`);
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/test-path** command!`
});

console.log('current working directory:', process.cwd())
console.log('process:', process.config.binding)
//console.log(global.appRoot = path.resolve(__dirname))