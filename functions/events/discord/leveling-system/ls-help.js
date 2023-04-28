const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

console.log(`${context.params.event.member.user.username} just triggered the /ls-help command!`)
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${context.params.event.member.user.id}> just triggered the **/ls-help** command!`
});

/* Embed with all commands details */
return lib.discord.channels['@0.2.2'].messages.create({
  content: ``,
  channel_id: context.params.event.channel_id,
  embed: {
    title: "Leveling System",
    color: 0xffffff,
    description: [
      "Bot detects your messages and count them, according to that it generates xp.\n",
      "`{prefix}level`: returns your level stats card.",
      "`{prefix}leaderboard`: returns the list of top members of the server according to their xp.",
      "`{prefix}setlvlbg`: allows you to set the background for your leveling card",
      "`{prefix}lvlblur`: enable/disable blur in your leveling card.",
      "`{prefix}boost boost`: give yourself a litle boost.",
      "`{prefix}boost left`: see, how many uses you have left.",
      "`{prefix}boost reset`: reset a users boost count"
    ].join("\n").replace(/{prefix}/g, '/ls-'), 
  }
});