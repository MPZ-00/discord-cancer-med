// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const prefix = process.env.PREFIX;
const moment = require('moment');
const message = context.params.event;
const { convert, data_options_value } = require('../../../../tools/functions.js')
const args = data_options_value(context.params.event.data.options);
const { Tools } = require('autocode-discordjs');

/*if (message.content === null) {
  args = data_options_value(context.params.event.data.options)
} else {
  args = message.content.slice(prefix.length).trim().split(/ +/g);
}*/

let who_executed = await lib.discord.channels['@0.2.2'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: `${context.params.event.member.user.username} used the **/info** command.`
})
console.log('mentions', context.params.event.mentions)

/* Get user */
const user = await lib.discord.guilds['@0.1.2'].members.retrieve({
  user_id: args.match(/\d+/g)[0] || args[0]?.match(/\d+/g)[0] || context.params.event.author.id,
  guild_id: context.params.event.guild_id
}).then(res => {
  return res.user;
}).catch(err => {
  return context.params.event.author
})
console.log('user', user)
console.log('convert', convert(user.id))

if (context.params.event.data.options === undefined) {
  console.log('No Data provided')
  return
}

function get_id(raw_id) {
  let str = `"${raw_id}"`
  const result = str.replace(/([^\d+])/gm, ``)
  console.log('Substitution result: ', result)
  return result
}

let target_id = user.id
if (context.params.event.data.options[0].name === 'user') {
  let value = data_options_value(context.params.event.data.options)
  target_id = get_id(value)
}

let convert_result = convert(target_id)

await lib.discord.channels['@0.2.0'].messages.create({
  "channel_id": `${context.params.event.channel_id}`,
  "content": "",
  "tts": false,
  "message_reference": {
    "message_id": `${who_executed.id}`,
    "fail_if_not_exists": true
  },
  "embeds": [
    {
      "type": "rich",
      "title": "",
      "description": `<@${user.id}>`,
      "color": 0x00FFFF,
      "fields": [
        {
          "name": `Joined`,
          "value": `${user.joined_at}`,
          "inline": true
        },
        {
          "name": `Created`,
          "value": `${convert_result.i_date24}\n${convert_result.i_timeago}`,
          "inline": true
        },
        {
          "name": `Roles [number]`,
          "value": `[Array]`
        },
        {
          "name": `Permissions`,
          "value": `String [Array]`
        }
      ],
      "author": {
        "name": `${user.username}#${user.discriminator}`,
        "icon_url": `${user.avatar_url}`
      },
      "footer": {
        "text": `${message.member.user.username}`,
        "icon_url": `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png`
      }
    }
  ]
});