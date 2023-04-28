/* Required Modules */
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

module.exports = (context) => {
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
        "`{prefix}boost`: give yourself a litle boost."
      ].join("\n").replace(/{prefix}/g, process.env.PREFIX), 
    }
  });
}