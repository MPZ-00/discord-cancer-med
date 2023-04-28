/**
 * An HTTP endpoint that acts as a webhook for Discord command event
 * @param {object} event
 * @returns {any} result
 */

module.exports = async (event, context) => {
  const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
  console.log(`${context.params.event.member.user.username} just triggered the /echo command!`)
  
  console.log('message: ', event.data.options[0])
  // retrieve the message to echo back from the command
  let message = event.data.options[0].value;
  
  if (!message) {
    return; // if there's no message do nothing
  }
  
  // echo the message back to the channel
  await lib.discord.channels['@0.0.3'].messages.create({
    channel_id: event.channel_id,
    content: message
  });
  
  return message;
}