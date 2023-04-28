const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { convert, data_options_value } = require('../../../../tools/functions.js')
const { get_permissions, search_permissions } = require('../../../../tools/perms.js')
const message = context.params.event

console.log(`${message.member.user.username} just triggered the /whois command!`)
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/whois** command!`
});

/*let result = await lib.discord.interactions['@0.0.0'].followups.create({
  token: context.params.event.token, // required
  content: 'dööt' // required
});*/

let ID = message.member.user.id
if (message.data.options && message.data.options[0]) {
  ID = message.data.options[0].value
}

console.log('ID', ID)
const member = await lib.discord.guilds['@0.1.3'].members.retrieve({
  user_id: ID,
  guild_id: message.guild_id
})

console.log('permissions:', message.member.permissions)
//console.log('permission names:', context.params.event.member.permission_names)
//console.log('perms:', get_permissions(message.member))

let t = await lib.discord.users['@0.1.6'].retrieve({
  user_id: `${ID}`
});
//console.log('t user:', t)

let tmp = await get_permissions(message.member.permission_names)
let target_sp = await search_permissions(member, message.guild_id)

console.log('search_permissions:', target_sp)
console.log('get_sp:', get_permissions(target_sp))

let result = await get_permissions(target_sp)

let perms = new Array()
for (let i = 0; i < result.length; i++) {
  perms.push(result[i].key)
}

let convert_result = convert(member.user.id)
let msg = await lib.discord.channels['@0.2.0'].messages.create({
  channel_id: `${message.channel_id}`,
  content: ``,
  tts: false,
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
        },
        {
          name: `Key Permissions`,
          value: perms.join(', ') || 'None'
        }
      ],
      author: {
        name: `${member.user.username}#${member.user.discriminator}`,
        icon_url: `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png`
      }
    }
  ]
});

// console.log('msg:', msg)
return msg