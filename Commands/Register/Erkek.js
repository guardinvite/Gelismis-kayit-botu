const { MessageEmbed } = require('discord.js')
const sett = require('../../settings.json')
const moment = require('moment')
const db = require('quick.db')

exports.run = async (client, message, args) => {
    if(![(sett.Roller.Register)].some(rol => message.member.roles.cache.get(rol)) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(new MessageEmbed .setTitle('Hata', message.author.avatarURL()) .setDescription(`Bu tarz komutlar için yetkin çok düşük!!`))

    let Kullanıcı = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let Erkek1 = sett.Roller.Erkek1
    let Erkek2 = sett.Roller.Erkek2
    let Tag = sett.Tags.Tag
    let UNTag = sett.Tags.UNTag
    let Kayıtsız = sett.Roller.Kayıtsız
    let TagRole = sett.Tags.TagRole
    let isim = args[1]
    let yaş = args[2]
    let aylartoplam = { "01": "Ocak", "02": "Şubat", "03": "Mart", "04": "Nisan", "05": "Mayıs", "06": "Haziran", "07": "Temmuz","08": "Ağustos", "09": "Eylül", "10": "Ekim", "11": "Kasım", "12": "Aralık" };
    let kayıtbas = moment(Date.now()).format("DD") + " " + aylartoplam[moment(Date.now()).format("MM")] + " " + moment(Date.now()).format("YYYY HH:mm:ss") 
    if(!Kullanıcı.id) return message.channel.send(new MessageEmbed .setTitle('Başarısız!', message.author.avatarURL()) .setDescription(`Kullanıcı belirtmeyi unuttun!!`) .setFooter(`${message.author}, Tarafından • ${Date.now()} Tarihinde kullanıldı!!`, message.author.avatarURL()))
    if(!isim) return message.channel.send(new MessageEmbed .setTitle('Başarısız!', message.author.avatarURL()) .setDescription(`İsim belirtmeyi unuttun!`) .setFooter(`${message.author}, Tarafından • ${Date.now()} Tarihinde kullanıldı!!`, message.author.avatarURL()))
    if(!yaş) return message.channel.send(new MessageEmbed .setTitle('Başarısız!', message.author.avatarURL()) .setDescription(`Yaş belirtmeyi unuttun!`) .setFooter(`${message.author}, Tarafından • ${Date.now()} Tarihinde kullanıldı!!`, message.author.avatarURL()))

    if (Kullanıcı.user.tag.includes(Tag)) { Kullanıcı.setNickname(`${Tag} ${isim} | ${yaş}`) } else { Kullanıcı.setNickname(`${UNTag} ${isim} | ${yaş}`) }

    setTimeout(() => {
    Kullanıcı.roles.cache.has(TagRole) ? Kullanıcı.roles.set([TagRole, Erkek1, Erkek2]) : Kullanıcı.roles.set([Erkek1, Erkek2]);
    }, 200) // eğer tag rol'ü varsa türm rolleri alıp tag erkek1 erkek2 atıcak eğer yok ise tüm rolleri alıp erkek1 erkek2 vericek

    db.push(`isimler.${Kullanıcı.id}`, { Olay: "(Erkek kayıt)", Tarih: kayıtbas, Yas: yaş, İsim: isim, Yetkili: message.author.id, Rol1: Erkek1, Rol2: Erkek2 }) // kayıt olana kullanıcının verilerini kaydettirdik
    db.push(`kayıtlarım.${message.author.id}`, { Olay: "(Erkek kayıt)", Tarih: kayıtbas, Yas: yaş, İsim: isim, User: Kullanıcı.id, Yetkili: message.author.id, Rol1: Erkek1, Rol2: Erkek2 }) // kullanıcıyı kaydeden yetkiliye de kaydettirdik
    db.add(`erkek.${message.author.id}.erkekkayıt`, 1) // erkek kayıda 1 eklettik
    db.add(`toplam.${message.author.id}.toplamkayıt`, 1) // toplam kayıda da 1 eklettik
    let erkekkayıt = db.fetch(`erkek.${message.author.id}.erkekkayıt`) // erkek kayıtı çektirdik
    let kadınkayıt = db.fetch(`kadın.${message.author.id}.kadınkayıt`) // kadın kayıtı çektirdik
    let toplamkayıt = db.fetch(`toplam.${message.author.id}.toplamkayıt`) // toplam kayıtı da çektirdik
    let isimler = db.get(`isimler.${Kullanıcı.id}`) // kullanıcının isim veritabanın'ı çektik çünkü isimleri için lazım
    let xyz = isimler.length > 0 ? isimler.map((value, index) => `• \`${value.İsim} | ${value.Yas}\` (<@&${value.Rol1}>, <@&${value.Rol2}>) - (<@${value.Yetkili}>)\n ${value.Olay} - ${value.Tarih}`).join(`\n\n`) : "Veritabanın da Kayıtlar'a ulaşılmadı!!"; // isimleri çektik çünkü kayıt için lazım

    const embed = new MessageEmbed()
    .setTitle('Başarılı!', message.author.avatarURL())
    .setDescription(`
    • **${Kullanıcı} isimli Kullanıcı, Başarılı şekilde \`${isim} | ${yaş}\`, Olarak kayıt edildi!**
    • **Yetkili: ${message.author}**
    
    **• Roller:**
    **• Alınan:** <@&${Kayıtsız}>
    **• Verilen:** <@&${Erkek1}>, <@&${Erkek2}>
    
    **• Yetkilinin Toplam Kayıtları:**
    **• Erkek Kayıt:** ${erkekkayıt || "0"}
    **• Kadın Kayıt:** ${kadınkayıt || "0"}
    **• Toplam Kayıt:** ${toplamkayıt || "0"}
    
    • **Kullanıcı Kayıt Bilgileri:**
    ${xyz}`)
    .setColor('BLUE')
    .setFooter(`github.com/Kinocshii • ${kayıtbas} Tarihinde kullanıldı!!`, message.author.avatarURL())
    message.channel.send(embed)
}

exports.conf = { enabled: true, guildOnly: false, aliases: ["e"], permLevel: 0 };
exports.help = { name: "erkek" }