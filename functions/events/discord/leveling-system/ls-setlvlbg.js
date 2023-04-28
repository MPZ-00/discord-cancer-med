const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { getLevel } = require('../../../../tools/functions.js')
const message = context.params.event

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/ls-setlevelbg** command!`
});

const level = await getLevel(message.member.user.id, message.guild_id)

if (message.data.options[0]?.name === 'url') {
  if (!message.data.options[0].value.match(/\.(jpeg|jpg|png)$/)) {
    // If url is invalid
    return await lib.discord.channels['@0.2.2'].messages.create({
      content: `❌ | Plesase provide valid url, only png or jpeg/jpg format supported`,
      channel_id: message.channel_id
    });
  } else {
    level.background = message.data.options[0].value
    await level.save()
    console.log('level:', level)
    return await lib.discord.channels['@0.3.0'].messages.create({
      content: `✅ ${level.background}`,
      channel_id: message.channel_id
    });
  }
} else {
  // If there is nothing in args
  if (!message.data.options) {
    return await lib.discord.channels['@0.2.2'].messages.create({
      content: `❌ | You need to provide image url while using command name, like this \`setlevelbg https://some-url.com\``,
      channel_id: message.channel_id
    });
  }
}