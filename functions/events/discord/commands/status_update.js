// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const message = context.params.event;
let hasAdmin_permissions = (message.member.permissions & (1<<3)) === (1<<3);
let hasAdmin_role = process.env.ROLE_ADMIN;
let isResponse = false

console.log(`${message.member.user.username} just triggered the /status-update command!`)

if (!hasAdmin_permissions && !hasAdmin_role) {
  await lib.discord.channels['@0.0.6'].messages.create({
    channel_id: message.channel_id,
    content: `You need to be an administrator to use this command.`
  })
  return
}

let data = {
  activity_name: 'Coding',
  activity_type: 'GAME',
  url: 'none',
  status: 'ONLINE'
}

for (let i = 0; i < 4; i++) {
  if (!message.data.options[i]) break
  let value = message.data.options[i].value;
  
  switch (message.data.options[i].name) {
    case 'activity_name': data.activity_name = value; break
    case 'activity_type': data.activity_type = value; break
    case 'url': data.url = value; break
    case 'status': data.status = value; break
    case 'response': isResponse = value; break
  }
}

console.info(data)

if (isResponse && (hasAdmin_permissions || hasAdmin_role)) {
  await lib.discord.channels['@0.2.0'].messages.create({
    'channel_id': `${message.channel_id}`,
    'content': '',
    'tts': false,
    'embeds': [
      {
        'type': 'rich',
        'title': `Bot Activity`,
        'description': '',
        'color': 0x00FFFF,
        'fields': [
          {
            'name': `Name`,
            'value': `${data.activity_name}`
          },
          {
            'name': `Type`,
            'value': `${data.activity_type}`
          },
          {
            'name': `URL`,
            'value': `${data.activity_type === 'STREAMING' ? data.url ? data.url : 'none' : 'none'}`
          },
          {
            'name': `Status`,
            'value': `${data.status}`
          }
        ],
        'author': {
          'name': `${message.member.user.username}#${message.member.user.discriminator}`,
          'icon_url': `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png`
        }
      }
    ]
  })
}

if (hasAdmin_permissions || hasAdmin_role) {
  if (data.activity_type === 'STREAMING') {
    await lib.discord.users['@0.1.6'].me.status.update({
      activity_name: `${data.activity_name}`,
      activity_type: `${data.activity_type}`,
      url: `${data.url ? data.url : 'none'}`,
      status: `${data.status}`
    })
  } else {
    await lib.discord.users['@0.1.6'].me.status.update({
      activity_name: `${data.activity_name}`,
      activity_type: `${data.activity_type}`,
      status: `${data.status}`
    })
  }
}