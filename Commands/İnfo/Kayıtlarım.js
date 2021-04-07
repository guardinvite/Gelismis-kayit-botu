const { MessageEmbed, Message } = require('discord.js')
const sett = require('../../settings.json')
const moment = require('moment')
const db = require('quick.db')

exports.run = async (client, message, args) => {
    if(![(sett.Roller.Register)].some(rol => message.member.roles.cache.get(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new MessageEmbed .setTitle('Hata', message.author.avatarURL()) .setDescription(`Bu tarz komutlar için yetkin çok düşük!!`) .setColor('RED'))

    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let erkekkayıt = db.fetch(`erkek.${message.author.id}.erkekkayıt`) // erkek kayıtı çektirdik
    let kadınkayıt = db.fetch(`kadın.${message.author.id}.kadınkayıt`) // kadın kayıtı çektirdik
    let toplamkayıt = db.fetch(`toplam.${message.author.id}.toplamkayıt`) // toplam kayıtı da çektirdik
    let kayıtlar = db.get(`kayıtlarım.${message.author.id}`)
    if(!kayıtlar) return message.channel.send('Veritabanın da kayıdın hiç yok!')
    let xuz = kayıtlar.length > 0 ? kayıtlar.map((value, index) =>
     `• <@${value.User}> - \`${value.İsim} | ${value.Yas}\` (<@&${value.Rol1}>, <@&${value.Rol2}>) - (<@${value.Yetkili}>)\n **${value.Olay} - ${value.Tarih}**`).join(`\n\n`) : "Veritabanın da Kayıtlar'a ulaşılmadı!!";

    const embed = new MessageEmbed()
    .setTitle(`${member}, İşte kayıt bilgilerin`, message.author.avatarURL())
    .setDescription(`${xuz} \n\n **Toplam Kayıtların:** \n**• Erkek Kayıt: ${erkekkayıt || "0"}**\n**• Kadın Kayıt: ${kadınkayıt || "0"}**\n**Toplam Kayıt: ${toplamkayıt || "0"}**`)
    .setColor('BLUE')
    message.channel.send(embed)
}

exports.conf = { enabled: true, guildOnly: false, aliases: ["kayıtlar"], permLevel: 0 };
exports.help = { name: "kayıtlarım" }