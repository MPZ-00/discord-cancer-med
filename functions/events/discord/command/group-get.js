const mongoose = require('mongoose');
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const {Groups} = require('../../../../tools/schema_settings.js');
const {
  std_no_Admin_response,
  is_Admin,
  has_Admin_Permission,
  create_embed,
} = require('../../../../tools/functions.js');
const prefix = process.env.PREFIX;
const moment = require('moment');
const message = context.params.event;
const subcommand = message.data.options[0]
const guildId = message.guild_id;
const blank_field = {name: `\u200b`, value: `\u200b`, inline: true}
const blank_field_f = {name: `\u200b`, value: `\u200b`, inline: false}

console.log(`${message.member.user.username} just triggered the /group-get ${subcommand.name} command!`)
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/group-get ${subcommand.name}** command!`,
});

async function getGroups(guildId) {
  if (!mongoose.connection.readyState) await mongoose.connect(process.env.MONGO_URL_SRV_SETTINGS);
  const group = await Groups.findOne({guildId});
  if (!group) {
    return new Groups({guildId});
  }
  return group;
}

//console.log('getGroups():', await getGroups(guildId))
//console.log('m.d.o[0]:', message.data.options[0])
console.log('subcommand:', subcommand.options)
switch (subcommand.name) {
  case 'group':
    return await groups_group(message)
  case 'all':
    return await groups_all(message)
  default:
    return await lib.discord.channels['@0.3.1'].messages.create({
      channel_id: `${message.channel_id}`,
      content: `Ups, something went wrong!`
    });
}
return;

async function groups_group(message) {
  const group = await getGroups(message.guild_id)
  let data_field = {name: ``, value: ``, inline: false}
  let all_items = []
  
  switch (message.data.options[0].options[0].value) {
    case 'personal-pronouns':
    case 'pronouns':
      group.personal_pronouns.forEach((item) => {
        all_items.push(`<@&${item.id}>`)
      })
      data_field.name = `Personal - Pronouns`
      break
    case 'personal-age':
    case 'age':
      group.personal_age.forEach((item) => {
        all_items.push(`<@&${item.id}>`)
      })
      data_field.name = `Personal - Age`
      break
    case 'personal-language':
    case 'language':
      group.personal_language.forEach((item) => {
        all_items.push(`<@&${item.id}>`)
      })
      data_field.name = `Personal - Language`
      break
    case 'hobbys':
      group.hobbys.forEach((item) => {
        all_items.push(`<@&${item}>`)
      })
      data_field.name = `Hobbys`
      break
    case 'games':
      group.games.forEach((item) => {
        all_items.push(`<@&${item}>`)
      })
      data_field.name = `Games`
      break
  }
  console.log('all_items:', all_items)
  
  data_field.value = `${all_items.join(', ')}`
  if (!data_field.value) data_field.value = `none`
  console.log('data_field:', data_field)
  
  await lib.discord.channels['@0.3.1'].messages.create({
    channel_id: `${message.channel_id}`,
    content: ``,
    embeds: [
    {
      title: ``,
      fields: [
        {
          name: data_field.name,
          value: data_field.value,
          inline: data_field.inline
        }
      ]
    }],
    color: 0x3498db
  })
}

async function groups_all(message) {
  const group = await getGroups(message.guild_id)
  
  let all_pronouns = [], all_ages = [], all_languages = [], all_hobbys = [], all_games = []
  
  group.personal_pronouns.forEach((item) => {
    all_pronouns.push(`<@&${item.id}>`)
  })
  console.log('all_pronouns:', all_pronouns)
  
  group.personal_age.forEach((item) => {
    all_ages.push(`<@&${item.id}>`)
  })
  console.log('all_ages', all_ages)
  
  group.personal_language.forEach((item) => {
    all_languages.push(`<@&${item.id}>`)
  })
  console.log('all_languages', all_languages)
  
  group.hobbys.forEach((item) => {
    all_hobbys.push(`<@&${item}>`)
  })
  if (!all_hobbys) all_hobbys.push(`none`)
  console.log('all_hobbys', all_hobbys)
  
  group.games.forEach((item) => {
    all_games.push(`<@&${item}>`)
  })
  if (!all_games) all_games.push(`none`)
  console.log('all_games', all_games)
  
  await lib.discord.channels['@0.3.1'].messages.create({
    channel_id: `${message.channel_id}`,
    content: ``,
    embeds: [
      {
        title: `Server Groups`,
        fields: [
          {
            name: `Personal - Pronouns`,
            value: `${all_pronouns.join(', ')}`,
            inline: false
          },
          {
            name: `Personal - Age`,
            value: `${all_ages.join(', ')}`,
            inline: false
          },
          {
            name: `Personal - Language`,
            value: `${all_languages.join(', ')}`,
            inline: false
          },
          {
            name: `Hobbys`,
            value: `${all_hobbys.join(', ')}`,
            inline: false
          },
          {
            name: `Games`,
            value: `${all_games.join(', ')}`,
            inline: false
          }
        ]
      }
    ],
    color: 0xcd201f
  });
}