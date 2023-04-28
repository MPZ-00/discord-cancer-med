const mongoose = require('mongoose');
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { Settings } = require('../../../../tools/schema_settings.js');
const { std_no_Admin_response, is_Admin } = require('../../../../tools/functions.js');
const prefix = process.env.PREFIX;
const message = context.params.event

console.log(`${message.member.user.username} just triggered the /settings command!`);
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/settings** command!`
});

await main(context.params.event)

async function getSettings(guildId) {
  if(!mongoose.connection.readyState) await mongoose.connect(process.env.MONGO_URL_SRV_SETTINGS)
  
  const settings = await Settings.findOne({guildId})
  if (!settings) {
    return new Settings({
      guildId
    })
  }
  return settings
}

await lib.discord.channels['@0.3.0'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: `Settings..`
});

console.log(await getSettings(context.params.event.guild_id))

async function main(event) {
  const settings_data = await getSettings(event.guildId)
  console.log('main()')
  console.log('settings_data:', settings_data)
  
  await lib.discord.channels['@0.3.0'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: [
      `**Settings**`,
      `guildId: ${settings_data.guildId}`,
      `languages: ${settings_data.languages}`,
      `default lang: ${settings_data.default_language}`,
      `server prefix: ${settings_data.prefix}`
    ].join('\n')
  });
}
