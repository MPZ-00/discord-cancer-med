const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

console.log(`${context.params.event.member.user.username} just triggered the /guild command!`)

let messageResponse = await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: `Hey <@!${context.params.event.member.user.id}>! I'm a bot powered by Autocode.`,
  embed: {
    title: 'Guild Information',
    type: 'rich',
    color: 0x0000AA, // Blue color
    description: 'You could add some information here for guild members to view!',
    fields: [{
      name: 'Message Formatting',
      value: [
        'Check out this link for more details on formatting message embeds:',
        'https://discord.com/developers/docs/resources/channel#embed-object-embed-structure'
      ].join('\n')
    }, {
      name: 'Setting up Slash Commands',
      value: [
        'Check out the README for this bot on Autocode for help setting up slash commands:',
        'https://autocode.com/app/discord/basic-discord-example/'
      ].join('\n')
    }]
  },
  tts: false
});

return messageResponse;