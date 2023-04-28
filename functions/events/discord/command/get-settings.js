const mongoose = require('mongoose');
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const {Settings} = require('../../../../tools/schema_settings.js');
const {
  std_no_Admin_response,
  is_Admin,
  has_Admin_Permission,
  create_embed,
} = require('../../../../tools/functions.js');
const prefix = process.env.PREFIX;
const moment = require('moment');
const message = context.params.event;
const guildId = message.guild_id;
const blank_field = {name: `\u200b`, value: `\u200b`, inline: true}

console.log(
  `${message.member.user.username} just triggered the /get-settings command!`
);
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/get-settings** command!`,
});

//const settings = await getSettings(guildId) // hiermit geht es iwi nicht mehr

async function getSettings(guildId) {
  if (!mongoose.connection.readyState)
    await mongoose.connect(process.env.MONGO_URL_SRV_SETTINGS);
  const setting = await Settings.findOne({guildId});
  if (!setting) {
    return new Settings({guildId});
  }
  return setting;
}

console.log('getSettings():', await getSettings(guildId));
//console.log('settings:', settings)

await list(message, guildId);

async function list(message, guildId) {
  const set = await getSettings(guildId);
  let lang_joined = set.languages.join(', ');
  await create_embed(
    message.channel_id,
    `Settings for guildId: ${guildId}`,
    `Server Settings`,
    [
      `guildId: ${set.guildId}`,
      `Prefix: ${set.prefix}`,
      `Languages: ${lang_joined}`,
      `Default Language: ${set.default_language}`,
    ].join('\n'),
    548259
  );

  await lib.discord.channels['@0.3.1'].messages.create({
    channel_id: `${message.channel_id}`,
    content: `Settings for guild_id: ${guildId}`,
    embeds: [
      {
        title: `Server Settings`,
        fields: [
          {
            name: `Prefix`,
            value: `${set.prefix}`,
            inline: true,
          },
          {
            name: `Languages`,
            value: `${lang_joined}`,
            inline: true,
          },
          {
            name: `Default Language`,
            value: `${set.default_language}`,
            inline: true,
          },
        ],
      },
    ],
    color: 28415,
  });
}
