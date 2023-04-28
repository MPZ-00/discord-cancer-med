const mongoose = require('mongoose');
const { Schema } = mongoose;

const Leveling = new Schema({
  guildId: String,
  userId: String,
  background: String,
  blur: { type: Boolean, default: true },
  message_count: {type: Number, default: 0},
  xp: {type: Number, default: 0},
  level: {type: Number, default: 1},
});

const Boost = new Schema({
  guildId: {type: String, default: "908739449381351474"},
  userId: String,
  boost_uses: {type: Number, default: 0},
  boost_last_used: {type: Date, default: 0},
  daily_used: {type: Number, default: 0},
  daily_last_used: {type: Date, default: 0}
});

const Settings = new Schema({
  guildId: String,
  languages: ["DE", "EN"],
  default_langauage: {type: String, default: "DE"},
  prefix: {type: String, default: "cm!"}
});

const Groups = new Schema({
  guildId: String,
  groups: [{
    personal: [{
      pronouns: [
        {
          description: {type: String, default: "she/her"},
          id: {type: String, default: "908768499747405835"}
        },
        {
          description: "he/him",
          id: {type: String, default: "908768567045013534"}
        },
        {
          description: "they/them",
          id: {type: String, default: "908768606165299260"}
        },
        {
          description: "ask please",
          id: {type: String, default: "908768651082084383"}
        }
      ]}, {
      age: [
        {description: {type: String, default: "18+"}, id: {type: String, default: "908767980077318174"}},
        {description: {type: String, default: "18-"}, id: {type: String, dafault: "908768023865864193"}},
        {description: {type: String, default: "18+ verified"}, id: {type: String, default: "908806870028943370"}}
      ]}, {
      language: [
        {
          lang: {type: String, default: "DE"},
          id: {type: String, default: "908823242020626532"}
        },
        {
          lang: {type: String, default: "EN"},
          id: {type: String, dafault: "908823277940654110"}
        }
      ]}
    ]}, {
    games: [{type: String}]
    }]
});

module.exports = {
  Leveling: mongoose.model('Leveling', Leveling),
  Boost: mongoose.model('Boost', Boost)
};