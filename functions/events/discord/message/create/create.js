// authenticates you with the API standard library
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const mongoose = require('mongoose');
const { addXp, addXp_boost } = require('../../../../../tools/functions.js')
const prefix = process.env.PREFIX
const message = context.params.event;
const isAdmin = message.member.roles.includes('908736261618020383'); // (message.member.permissions & (1<<3)) === (1<<3)
const isHello = true // weil es irgendwie auf alles antwortet :(
const isLogging = true

let germanLanguage = '908823242020626532';
let englishLanguage = '908823277940654110';

async function action_log() {
  console.log(`${message.author.username} used the ${prefix}${command} command.`)
  await lib.discord.channels['@0.2.0'].messages.create({
    channel_id: process.env.ACTION_LOG,
    content: `<@${message.author.id}> used the **${prefix}${command}** command.`
  })
}

if(!message.content.startsWith(prefix)) {
  if (message.content.startsWith('.') || message.content.startsWith('!') || message.content.startsWith('?')) {
    return
  }
  
  let contentMessage = `${message.content}!`;
  let regex_match = /^\b(hi|hoi|moin|servus|hey|hallo|hello|huhu|Hello|Bonjour|Hola|Salaam|Guten Morgen|Guten Tag|Guten Mittag|Guten Abend|Gute Nacht|Hello|good morning|good evening|good afternoon|good night|guten Tag zusammen|hallöchen|jut nacht|jut nächtle|moinsen|mach's gut|machs gut|bye|tschö|tschüss|bye|こにちわ|grüß gott|grüss gott|jo)/gi;
  /* ([^.\s+ ]) */
  let _chat = '908732130337652811'
  
  if (message.channel_id === _chat) {
  // only respond to messages containing hi|hey|hello|etc.
    if (message.content.match(regex_match) && isHello) {
      if (message.member.roles.includes(germanLanguage)) {
        contentMessage = `Dir auch ${message.content} :wave:`;
      } else if (message.member.roles.includes(englishLanguage)) {
        contentMessage = `${message.content} to you too :wave:`;
      }
      console.log(`channel_id: ${message.channel_id}`)
    
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id: message.channel_id,
        content: contentMessage,
        message_reference: {
          message_id: message.id,
          fail_if_not_exists: true
        }
      })
    }
  }
  return addXp(message)
}

const args = message.content.slice(prefix.length).trim().split(/ +/g);
const command = args.shift().toLowerCase();
console.log('command:', command)
console.log('args:', args)

if (isLogging) action_log()

switch (command) {
  case "help":
    await lib.discord.channels['@0.1.1'].messages.create({
      channel_id: `${message.channel_id}`,
      content: `${message.member.roles.includes(germanLanguage) ? 'Ich bin bereit zu helfen! Fangen wir an.' : 'I\'m Ready to Help! Let\'s get started.'}`,
      message_reference: {
        message_id: `${message.id}`
      },
      components: [{
          type: 1,
          components: [{
              type: 2,
              label: `${message.member.roles.includes(germanLanguage) ? 'Weiter' : 'Continue'}`,
              style: 3,
              custom_id: 'help-firstpage',
            },
            {
              type: 2,
              label: `${message.member.roles.includes(germanLanguage) ? 'Verlassen' : 'Exit'}`,
              style: 4,
              custom_id: 'help-exit',
            }]
        }]
    })
    break
  case "level":
    await require('../../../../commands/level.js')(context, args)
    break
  case "setlvlbg":
    await require('../../../../commands/setlevelbg.js')(context, args)
    break
  case "leaderboard":
    await require('../../../../commands/leaderboard.js')(context, args)
    break
  case "lvlblur":
    await require('../../../../commands/blur.js')(context, args)
    break
  case "help-levelsystem":
    await require('../../../../commands/help_levelsystem.js')(context, args)
    break
  case "updaterank":
    console.info(`isAdmin: ${isAdmin}`)
    if (isAdmin) {
      await require('../../../../commands/updaterank.js')(context, args)
    }
    break
  case "whois":
    await require('../../../../commands/whois.js')(context, args)
    break
  case "xp":
    return addXp(message).then(console.log())
    break
  case "boost":
    if (isAdmin || message.member.roles.includes('908808162780524585') || message.member.roles.includes('908808508747706378') || message.member.roles.includes('908808569367986196') || message.member.roles.includes('908808638800470026') || message.member.roles.includes('908808691615170580') || message.member.roles.includes('908809292554043483')) { // when isAdmin or has any paid color
      //addXp_boost(message, args)
      await require('../../../../commands/boost.js')(context, args)
    } else {
      await lib.discord.channels['@0.2.0'].messages.create({
        channel_id: message.channel_id,
        content: `You need to be an Admin or have any of the paid colors (*available in \`.shop\`*)`,
        message_reference: {
          message_id: message.id
        }
      })
    }
    break
  case "drenius":
    console.log('before', drenius)
    drenius = new Date()
    console.log('after', drenius)
    break
  case "mongo":
    if (isAdmin) {
      await require('../../../../commands/test/some_mongo.js')(context, args)
    } else {
      std_no_Admin_response('mongo')
    }
    break
  default:
    console.log('wait what!?')
    await lib.discord.channels['@0.2.0'].messages.create({
      channel_id: message.channel_id,
      content: `wait what!?`,
      message_reference: {
        message_id: message.id
      }
    })
}

return addXp(message)