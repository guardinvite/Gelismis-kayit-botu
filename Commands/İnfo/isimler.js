const { MessageEmbed, Message } = require('discord.js')
const sett = require('../../settings.json')
const db = require('quick.db')

exports.run = async (client, message, args) => {
    if(![(sett.Roller.Register)].some(rol => message.member.roles.cache.get(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new MessageEmbed .setTitle('Hata', message.author.avatarURL()) .setDescription(`Bu tarz komutlar için yetkin çok düşük!!`) .setColor('RED'))

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let isimler = db.get(`isimler.${member.id}`)
    if(!isimler) return message.channel.send("Veritabanın da hiç isimler'e rastlanmadı!!")
    let xkz = isimler.length > 0 ? isimler.map((value, index) => `• \`${value.İsim} | ${value.Yas}\` (<@&${value.Rol1}>, <@&${value.Rol2}>) - (<@${value.Yetkili}>)\n **${value.Olay} - ${value.Tarih}**`).join(`\n\n`) : "Veritabanın da Kayıtlar'a ulaşılmadı!!";

    const embed = new MessageEmbed()
    .setTitle(`${member.tag}, İsimli kullanıcının kayıt bilgileri`, message.author.avatarURL())
    .setDescription(`${xkz}`)
    .setColor('BLUE')
    message.channel.send(embed)
}

exports.conf = { enabled: true, guildOnly: false, aliases: ["geçmiş-kayıt", "önceki-kayıtlar", "eski-kayıtlar", "geçmişkayıtlar", "öncekikayıtlar", "eskikayıtlar"], permLevel: 0 };
exports.help = { name: "isimler" }