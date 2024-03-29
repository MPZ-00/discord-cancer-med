// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

console.log(`<@!${context.params.event.member.user.username}> just triggered the /member-count command!`)
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `<@!${context.params.event.member.user.id}> just triggered the **/member-count** command!`
});

let members;
try { 
  members = await lib.discord.guilds['@0.0.6'].members.list({
    guild_id: `${context.params.event.guild_id}`,
    limit: 1000
  });
} catch (e) {
  await lib.discord.channels['@0.0.6'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: [
      `Whoops, it seems retrieving the number of members in the guild failed.`,
      `Your bot needs special permission to view the members in your guild.`,
      '',
      `You can check out the README for this Autocode app for help setting that up:`,
      'https://autocode.com/app/discord/basic-discord-example/'
    ].join('\n')
  });
  throw e;
}

let memberCountText = members.length < 1000 ? members.length : 'over 1000';

let messageResponse = await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: [
    `Hey <@!${context.params.event.member.user.id}>! I'm a bot powered by Autocode.`,
    `There are currently **${memberCountText}** users and bots in this guild.`
  ].join('\n')
});

return messageResponse;