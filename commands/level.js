const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const requestImageSize = require('request-image-size');
const { getLevel, change, getAvatar, getRank } = require('../tools/functions.js');
const Canvas = require('canvas');
const jimp = require('jimp');
Canvas.registerFont(require('@canvas-fonts/arial-bold'), {
  family: 'Arial Bold',
});

module.exports = async (context, args) => {
  /* Get user */
  const user = await lib.discord.guilds['@0.1.2'].members.retrieve({
    user_id: args[0]?.match(/\d+/g)[0] || context.params.event.author.id,
    guild_id: context.params.event.guild_id
  }).then(res => {
    return res.user;
  }).catch(err => {
    return context.params.event.author
  })
  console.log('User', user)
  
  /* Get user leveling data */
  const userLevel = await getLevel(
    user.id,
    context.params.event.guild_id
  )
  console.log('userLevel', userLevel)
  
  /* Details to fill in rank card */
  const currentXP = userLevel.xp;
  const fullXP = userLevel.level * userLevel.level * 100
  const level = `${userLevel.level}`;
  const url = userLevel.background || 'https://i.pinimg.com/564x/23/b5/fb/23b5fb4ad5cc1d46d58c751d4389ba04.jpg';
  const rank = await getRank(user.id, context.params.event.guild_id, "xp")
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
    'https://media.discordapp.net/attachments/636154061724450826/738273549525057556/20200730_112506.png'
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
    content: `User: ${user.username}`,
    channel_id: context.params.event.channel_id,
    message_reference: {
      message_id: context.params.event.id,
      channel_id: context.params.event.channel_id
    },
    file: data,
    filename: 'level.png',
  });
};