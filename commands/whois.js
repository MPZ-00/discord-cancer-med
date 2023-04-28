const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN})
const { convert } = require('../tools/functions.js')

module.exports = async (context, args) => {
  const ID = context.params.event.mentions[0] ? context.params.event.mentions[0].id : context.params.event.author.id
  const member = await lib.discord.guilds['@0.1.3'].members.retrieve({
    user_id: ID,
    guild_id: context.params.event.guild_id
  })
  //console.log('member:', member)

  let convert_result = convert(member.user.id)
  let msg = await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: ``,
    tts: false,
    message_reference: {
      message_id: `${context.params.event.id}`,
      channel_id: `${context.params.event.channel_id}`,
      fail_if_not_exists: true
    },
    embeds: [
      {
        type: `rich`,
        title: ``,
        description: `<@${member.user.id}>`,
        color: 0x00FFFF,
        fields: [
          {
            name: `Joined At`,
            value: `${new Date(member.joined_at).toLocaleString('de-DE')}`,
            inline: true
          },
          {
            name: `Created At`,
            value: `${convert_result.i_date24} | ${convert_result.i_timeago}`,
            inline: true
          },
          {
            name: `Roles [${member.roles.length}]`,
            value: member.roles.length ? member.roles.map((x) => `<@&${x}>`).join(' ') : `No Roles`
          }
        ],
        author: {
          name: `${member.user.username}#${member.user.discriminator}`,
          icon_url: `${member.user.avatar_url}`
        }
      }
    ]
  });
  
  // console.log('msg:', msg)
  return msg
}