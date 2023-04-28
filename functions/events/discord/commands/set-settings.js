const mongoose = require('mongoose');
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const { Settings } = require('../../../../tools/schema_settings.js');
const { std_no_Admin_response, is_Admin } = require('../../../../tools/functions.js');
const prefix = process.env.PREFIX;
const message = context.params.event

const settings_data = await getSettings(message.guildId)
let subcommand = message.data.options[0]

console.log(`${message.member.user.username} just triggered the /set-settings ${subcommand.name + ' '}command!`);
await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/set-settings ${subcommand.name + ' '}** command!`
});

await main(context.params.event)

async function getSettings(guildId) {
  if(!mongoose.connection.readyState) await mongoose.connect(process.env.MONGO_URL_SRV_SETTINGS)
  if (!guildId) {guildId = context.params.event.guild_id}
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
  content: `Executing: ${message.data.name} ${message.data.options[0].name}`
});

//console.log(await getSettings(context.params.event.guild_id))

async function main(event) {
  console.log('main()')
  
  //console.log('settings_data:', settings_data)
  //console.log('command: ', event.data.name)
  //console.log('data: ', event.data.options)
  
  await run_subcommand(event.data)
}
async function run_subcommand(data) {
  let name = data.options[0].name
  let options = data.options[0]
  console.log(`Executing: ${name}`, 'Options:', data.options)
  switch(name) {
    case 'add-language':
      await add_language(options.options)
      break
    case 'set-prefix':
      await set_prefix(options)
      break
    case 'set-default-language':
      await set_default_language(options)
      break
  }
}

async function add_language(options) {
  let lang = {name: '', role: ''}
  console.log('add_language()')
  console.log('options:', options)
  
  lang.name = options.find(obj => obj.name === 'description').value
  lang.role = options.find(obj => obj.name === 'role').value
  
  console.log('lang:', lang)
  // console.log(`.name: ${options.name}, [0].name: ${options[0].name}`)
  let lang_arr = await getSettings().languages
  console.log('lang_arr:', lang_arr)
  
  if (lang_arr == undefined) {
    await getSettings().languages.push(lang.name)
    await getSettings().save()
    return
  }
  
  if (lang_arr.findIndex(lang.name) != (-1 || undefined)) {
    console.log(`gS().l includes ${lang.name}`)
  } else {
    console.log(`adding: ${lang.name}`)
  }
}

async function set_prefix(options) {
  console.log(`prefix (old/new): ${settings_data.prefix}/${options[0].value}`)
  if (settings_data.prefix !== options[0].value) {
    settings_data.prefix = options[0].value
    await settings_data.save()
  }
}

async function set_default_language(options) {
  let new_default_lang = options[0].value
  console.log(`default language (old/new): ${await getSettings().default_language}/${new_default_lang}`)
  if (settings_data.default_language !== new_default_lang) {
    settings_data.default_language = new_default_lang
    await settings_data.save()
  }
}