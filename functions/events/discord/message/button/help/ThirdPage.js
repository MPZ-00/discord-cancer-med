// authenticates you with the API standard library
// type `await lib.` to display API autocomplete
const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const prefix = process.env.PREFIX;
const lang_DE = context.params.event.member.roles.includes(process.env.LANGUAGE_GERMAN);

await lib.discord.channels['@0.1.1'].messages.update({
  message_id: `${context.params.event.message.id}`,
  channel_id: `${context.params.event.message.channel_id}`,
  content: `${lang_DE ? 'Also, hier sind einige meiner Befehle!' : 'Alright Here Are some of my commands!'}`,
  message_reference: {
    message_id: `${context.params.event.id}`
  },
  embed: {
      title: `${lang_DE ? 'Befehle' : 'Commands'}`,
      type: 'rich',
      description: `${lang_DE ? 'Hier sind die vielen Befehle, die ich ausführen kann' : 'Here are the many commands I can Execute'}`,
      color: 0xb7ffd8,
      footer: {
        text: `${lang_DE ? 'Benutze die Pfeile unten zum Blättern.' : 'Use the arrows below to scroll.'}`,
      },
    fields: [
      {
        name: `${prefix}command1`,
        value: `${lang_DE ? 'Beschreibung' : 'description'}`
      },
      {
        name: `${prefix}command2`,
        value: `${lang_DE ? 'Beschreibung' : 'description'}`
      },
      {
        name: `${prefix}command3`,
        value: `${lang_DE ? 'Beschreibung' : 'description'}`
      },
      {
        name: `${prefix}command4`,
        value: `${lang_DE ? 'Beschreibung' : 'description'}`
      },
      {
        name: `${prefix}command5`,
        value: `${lang_DE ? 'Beschreibung' : 'description'}`
      }
    ]
  },
  components: [
    {
      type: 1,
      components: [
        {
          type: 2,
          label: `${lang_DE ? 'Verlassen' : 'Exit'}`,
          style: 4,
          custom_id: 'help-exit',
        },
        {
          type: 2,
          style: 2,
          emoji: {name: '◀️'},
          custom_id: 'help-secondpage',
        },
      ],
    },
  ],
});