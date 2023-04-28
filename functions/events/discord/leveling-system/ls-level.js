const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const message = context.params.event
const requestImageSize = require('request-image-size');
const { getLevel, change, getAvatar, getRank } = require('../../../../tools/functions.js');
const Canvas = require('canvas');
const jimp = require('jimp');
Canvas.registerFont(require('@canvas-fonts/arial-bold'), {
  family: 'Arial Bold',
});

console.log(`${message.member.user.username} just triggered the /ls-level command!`)
let log_msg = await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: process.env.ACTION_LOG,
  content: `<@!${message.member.user.id}> just triggered the **/ls-level** command!`
});

//await require('../../../../commands/level.js')(context, args)
let args = message.member.user.id
if (message.data.options[0]?.name === 'user') {
  args = message.data.options[0].value
}

await lib.discord.channels['@0.3.0'].messages.update({
  message_id: `${log_msg.id}`,
  channel_id: `${log_msg.channel_id}`,
  content: `${log_msg.content}\nis author: ${message.data.options[0]?.name ? 'no' : 'yes'}\nargs: ${args}`
});

/* Get user */
const user = await lib.discord.guilds['@0.1.2'].members.retrieve({
  user_id: message.data.options[0]?.value || message.member.user.id,
  guild_id: message.guild_id
}).then(res => {
  return res.user;
}).catch(err => {
  return message.member.user
})
console.log('User', user)

/* Get user leveling data */
const userLevel = await getLevel(
  user.id,
  message.guild_id
)
console.log('userLevel', userLevel)

/* Details to fill in rank card */
const currentXP = userLevel.xp;
const fullXP = userLevel.level * userLevel.level * 100
const level = `${userLevel.level}`;
const url = userLevel.background || 'https://mpz-00.public.files.stdlib.com/_stdlib/provider/MPZ-00/images/ls-userlevel_background.jpg';
const rank = await getRank(user.id, message.guild_id, "xp")
const image = await requestImageSize(url);

/* Canvas setup */
const canvas = Canvas.createCanvas(700, 250);
const ctx = canvas.getContext('2d');

/* Scale background in middle */
let scale = Math.max(canvas.width / image.width, canvas.height / image.height);
let x = canvas.width / 2 - (image.width / 2) * scale;
let y = canvas.height / 2 - (image.height / 2) * scale;

let background = await jimp.read(url);
let layer = await Canvas.loadImage(
  'https://mpz-00.public.files.stdlib.com/_stdlib/provider/MPZ-00/images/ls-level_background.png'
);

/* Blur background if user wants */
if (userLevel.blur) background.blur(2);
background = await background.getBufferAsync('image/png');
ctx.drawImage(await Canvas.loadImage(background), x, y, image.width * scale, image.height * scale);
ctx.strokeRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(layer, 0, 0, canvas.width, canvas.height);

/* Add avatar */
let avatar = await jimp.read(getAvatar(user));
avatar.resize(1024, 1024);
avatar.circle();
avatar = await avatar.getBufferAsync('image/png');
avatar = await Canvas.loadImage(avatar);
ctx.drawImage(avatar, 44, 48, 155, 155);

/* Username, Discriminator, XP */
ctx.font = `bold 20px 'Arial Bold'`;
ctx.fillStyle = '#FFFFFF';
ctx.textAlign = 'start';
ctx.strokeStyle = '#f5f5f5';
ctx.fillText(user.username, 340, 52);
ctx.fillText(user.discriminator, 580, 84);
ctx.fillText('/ ' + change(fullXP), 240 + ctx.measureText(change(currentXP)).width + 15, 142);
ctx.fillText(currentXP, 240, 142);

/* Xp progress bar */
let converted = currentXP;
let widthXP = (converted * 439) / fullXP;
if (widthXP > 439 - 18.5) widthXP = 439 - 18.5;
ctx.beginPath();
ctx.fillRect(239, 119.5 + 36.25, widthXP, 23.5);

const RankN = rank.length > 5 ? rank.substring(0, 5).trim() + '+' : rank;
ctx.fillText(`${RankN}`, 310, 210);

const levelN = level.length > 6 ? level.substring(0, 6).trim() + '+' : level;
ctx.fillText(`${levelN}`, 500, 210);

let data = await canvas.toBuffer();
await lib.discord.channels['@0.2.0'].messages.create({
  content: ``,
  channel_id: message.channel_id,
  /*message_reference: {
    message_id: message.id,
    channel_id: message.channel_id
  },*/
  file: data,
  filename: 'ls-level_background.png.png',
  /*embeds: [
    {
      type: 'rich',
      title: `Levelling System`,
      description: '',
      color: 0x00FFFF,
      author: {
        name: `${user.username}#${user.discriminator}`,
        icon_url: `${user.avatar_url}`
      },
      footer: {
        text: `${message.member.user.username}`,
        icon_url: `https://cdn.discordapp.com/avatars/${message.member.user.id}/${message.member.user.avatar}.png`
      }
    }
  ]*/
});