const mongoose = require('mongoose');
const {Schema} = mongoose;

const Settings = new Schema({
  guildId: String,
  languages: [
    {type: String, default: 'DE'} /*, {type: String, default: "EN"}*/,
  ],
  default_language: {type: String, default: 'DE'},
  prefix: {type: String, default: 'cm!'},
});

const Groups_bugged = new Schema({
  guildId: String,
  groups: [
    {
      personal: [
        {
          pronouns: [
            {
              description: {type: String, default: 'she/her'},
              id: {type: String, default: '908768499747405835'},
            },
            {
              description: 'he/him',
              id: {type: String, default: '908768567045013534'},
            },
            {
              description: 'they/them',
              id: {type: String, default: '908768606165299260'},
            },
            {
              description: 'ask please',
              id: {type: String, default: '908768651082084383'},
            },
          ],
        },
        {
          age: [
            {
              description: {type: String, default: '18+'},
              id: {type: String, default: '908767980077318174'},
            },
            {
              description: {type: String, default: '18-'},
              id: {type: String, dafault: '908768023865864193'},
            },
            {
              description: {type: String, default: '18+ verified'},
              id: {type: String, default: '908806870028943370'},
            },
          ],
        },
        {
          language: [
            {
              lang: {type: String, default: 'de-DE'},
              id: {type: String, default: '908823242020626532'},
            },
            {
              lang: {type: String, default: 'en-US'},
              id: {type: String, dafault: '908823277940654110'},
            },
          ],
        },
      ],
    },
    {
      hobbys: [{type: String}],
    },
    {
      games: [{type: String}],
    },
  ],
});

const Groups = new Schema({
  guildId: String,
  personal_pronouns: {
    type: Array,
    default: [
      {
        description: 'she/her',
        id: '908768499747405835',
      },
      {
        description: 'he/him',
        id: '908768567045013534',
      },
      {
        description: 'they/them',
        id: '908768606165299260',
      },
      {
        description: 'ask please',
        id: '908768651082084383',
      },
    ],
  },
  personal_age: {
    type: Array,
    default: [
      {
        description: '18+',
        id: '908767980077318174',
      },
      {
        description: '18-',
        id: '908768023865864193',
      },
      {
        description: '18+ verified',
        id: '908806870028943370',
      },
    ],
  },
  personal_language: {
    type: Array,
    default: [
      {
        lang: 'de-DE',
        id: '908823242020626532',
      },
      {
        lang: 'en-US',
        id: '908823277940654110',
      },
    ],
  },
  hobbys: [{type: String}],
  games: [{type: String}],
});

module.exports = {
  Settings: mongoose.model('Setting', Settings),
  Groups: mongoose.model('Group', Groups),
};
