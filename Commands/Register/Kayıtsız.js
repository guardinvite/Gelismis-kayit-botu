const { MessageEmbed } = require('discord.js')
const db = require('quick.db')
const moment = require('moment')
const sett = require('../../settings.json')

exports.run = async (client, message, args) => {
    if(![(sett.Roller.Register)].some(rol => message.member.roles.cache.get(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new MessageEmbed .setTitle('Hata', message.author.avatarURL()) .setDescription(`Bu tarz komutlar için yetkin çok düşük!!`))

    let Kullanıcı = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let kayıtsızrol = sett.Roller.Kayıtsız // kayıtsız rol'ü tanımladık
    let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz","08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
    let kayıtbas = moment(Date.now()).format("DD") + " " + aylartoplam[moment(Date.now()).format("MM")] + " " + moment(Date.now()).format("YYYY HH:mm:ss") 
    
    Kullanıcı.roles.set([kayıtsızrol]) // set ile tüm rollerini alıp kayıtsız rol'ü verdik
    db.push(`isimler.${Kullanıcı.id}`, { İsim: "İsim", Yas: "Yaş", Olay: "(Kayıtsız'a Yollandı)", Tarih: kayıtbas, Yetkili: message.author.id, Rol1: kayıtsızrol, Rol2: kayıtsızrol}) // isimler kodu için lazm olucak
    const embed = new MessageEmbed()
    .setTitle('Başarılı!', message.author.avatarURL())
    .setDescription(`
    • **${Kullanıcı}, İsimli kullanıcı başarılı şekilde kayıtsız'a yollandı**`)
    .setColor('BLUE')
    .setFooter(`github.com/Kinocshii • ${kayıtbas} Tarihinde kullanıldı!!`, message.author.avatarURL())
    message.channel.send(embed)
    Kullanıcı.setNickname('• İsim | Yaş') // kullanıcı kayıtsız'a atıldığı için ismini İsim | yaş yaptık
}

exports.conf = { enabled: true, guildOnly: false, aliases: [], permLevel: 0 };
exports.help = { name: "kayıtsız" }