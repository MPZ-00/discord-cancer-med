const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN})
const { getLevel } = require('../tools/functions.js')

module.exports = async (context, args) => {
  // Easy access variable
  const {author, guild_id, channel_id, id} = context.params.event
  
  // If there is nothing in args
  if (!args.length) {
    return lib.discord.channels['@0.2.2'].messages.create({
      content: `❌ | You need to provide image url while using command name, like this \`setlevelbg https://some-url.com\``,
      channel_id,
      message_reference: {
        message_id: id,
        channel_id
      }
    });
  }
  
  // If url is invalid
  if (!args[0].match(/\.(jpeg|jpg|png)$/)) {
    return lib.discord.channels['@0.2.2'].messages.create({
      content: `❌ | Plesase provide valid url, only png or jpeg/jpg format supported`,
      channel_id,
      message_reference: {
        message_id: id,
        channel_id
      }
    });
  }
}