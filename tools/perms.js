const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

function get_permissions(permissions) {
  let arr = new Array()
  for (let i = 0; i < permissions.length; i++) {
    //console.log('pn: ', i, permissions.permission_names[i])
    switch (permissions[i]) {
      case 'ADMINISTRATOR':
        arr.push({key: 'Administrator', value: 0})
        break
      case 'MANAGE_CHANNELS':
        arr.push({key: 'Manage Channels', value: 10})
        break
      case 'MANAGE_ROLES':
        arr.push({key: 'Manage Roles', value: 11})
        break
      case 'MANAGE_MESSAGES':
        arr.push({key: 'Manage Messages', value: 13})
        break
      case 'MANAGE_EMOJIS':
        arr.push({key: 'Manage Emojis', value: 14})
        break
      case 'MANAGE_WEBHOOKS':
        arr.push({key: 'Manage Webhooks', value: 15})
        break
      case 'MANAGE_THREADS':
        arr.push({key: 'Manage Threads', value: 16})
        break
      case 'VIEW_AUDIT_LOG':
        arr.push({key: 'View audit log', value: 20})
        break
      case 'BAN_MEMBERS':
        arr.push({key: 'Ban Members', value: 30})
        break
      case 'KICK_MEMBERS':
        arr.push({key: 'Kick Members', value: 31})
        break
      case 'MOVE_MEMBERS':
        arr.push({key: 'Move Members', value: 32})
        break
      case 'MUTE_MEMBERS':
        arr.push({key: 'Mute Members', value: 33})
        break
      case 'DEAFEN_MEMBERS':
        arr.push({key: 'Deafen Members', value: 34})
        break
      case "MENTION_EVERYONE":
        arr.push({key: 'Mention @everyone, @here, and All Roles', value: 40})
        break
      case 'SEND_TTS_MESSAGES':
        arr.push({key: 'Send TTS Messages', value: 41})
        break
      case 'PRIORITY_SPEAKER':
        arr.push({key: 'Priority Speaker', value: 42})
        break
      case 'USE_SLASH_COMMANDS':
        arr.push({key: 'Use Slash Commands', value: 43})
        break
    }
  }
  arr.sort((a,b) => a.value - b.value)
  // console.log('arr', arr)
  return arr;
}

async function search_permissions(member, guild_id) {
  console.log('member.roles:', member.roles)
  
  let raw_roles_list = await lib.discord.guilds['@0.1.3'].roles.list({
    guild_id: guild_id
  });
  //console.log('sp.raw_roles_list:', raw_roles_list)
  
  let merge_roles_list = new Array()
  
  for (let i = 0; i < raw_roles_list.length; i++) {
    //console.log(`${i}: ${raw_roles_list[i].id}`)
    for (let j = 0; j < member.roles.length; j++) {
      if (raw_roles_list[i].id === member.roles[j]) {
        //console.log('Ja', member.roles[j])
        await add_if_not_exist(merge_roles_list, raw_roles_list[i].permission_names)
      }
    }
  }
  return merge_roles_list
}

async function add_if_not_exist(target_array, add_value) {
  for (let i = 0; i < add_value.length; i++) {
    if (target_array.includes(add_value[i])) {
      // console.log(`found: ${add_value[i]}`)
    } else {
      target_array.push(add_value[i])
    }
  }
  // console.log('target_array:', target_array)
}

module.exports = {get_permissions, search_permissions}