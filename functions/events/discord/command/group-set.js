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

console.log(`${message.member.user.username} just triggered the /group-set ${subcommand.name} command!`)
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/group-set ${subcommand.name}** command!`,
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
  case 'personal':
    return await groups_set_personal(message)
  case 'other':
    return await groups_set_other(message)
  default:
    return await lib.discord.channels['@0.3.1'].messages.create({
      channel_id: `${message.channel_id}`,
      content: `Ups, something went wrong!`
    });
}
return;

async function groups_set_personal(message) {}

async function groups_set_other(messsage) {
  const group = await getGroups(message.guild_id)
  let value = subcommand.options.find(x => x.name === 'role-id').value
  value = value.substring(3, value.length - 1)
  console.log('value:', value)
  switch (subcommand.options.find(x => x.name === 'group').value) {
    case 'hobbys':
      if (!group.hobbys.includes(value)) {
        group.hobbys.push(value)
        await group.save()
      }
      return
    case 'games':
      if (!group.games.includes(value)) {
        group.games.push(value)
        await group.save()
      }
      return
    default:
      return await lib.discord.channels['@0.3.1'].messages.create({
        channel_id: `${message.channel_id}`,
        content: `Ups, something went wrong!`
      });
  }
}