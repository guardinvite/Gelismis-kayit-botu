const Discord = require('discord.js');
const sett = require('./settings.json')
const client = new Discord.Client();
const AsciiTable = require("ascii-table")
const figlet = require('figlet');
const moment = require('moment');
const ayarlar = require('./ayarlar.json')
const { Client, Util } = require('discord.js');
const fs = require('fs');
require('./Util/eventLoader.js')(client);

var commandtable = new AsciiTable('github.com/Kinocshii');

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

commandtable.setHeading("Command", 'Status', "Aliases")
fs.readdirSync('./Commands').forEach(dir => {
const commandFiles = fs.readdirSync(`./Commands/${dir}/`).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
const commandsall = require(`./Commands/${dir}/${file}`);
if (commandsall.help.name) {

client.commands.set(commandsall.help.name, commandsall);
commandtable.addRow(commandsall.help.name, "ÇALIŞIYOR", commandsall.conf.aliases)
} else {
commandtable.addRow(commandsall.help.name, "HATALI")
continue;
}
commandsall.conf.aliases.forEach(alias => {
client.aliases.set(alias, commandsall.help.name);
});
}
})
console.log(commandtable.toString())

figlet('github.com/Kinocshii', function(err, data) {
console.log(data)
});

client.elevation = message => {
if (!message.guild) {
return;
}

let permlvl = 0;
if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
if (message.author.id === ayarlar.sahip) permlvl = 4;
return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
// client.on('debug', e => {
// console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });
client.on('warn', e => {
console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});
client.on('error', e => {
console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});

//////////////////////////////////////////////////////////////////////////////////////

      client.on('ready', () => {
      client.user.setActivity('github.com/Kinocshii')
      client.user.setStatus("dnd");
      console.log(`${client.user.tag} Logining!`);
      });

      client.on("guildMemberAdd", member => {
      let kanal = sett.Kanallar.Hoşgeldin
      let tag = sett.Tags.Tag
      let user = client.users.cache.get(member.id);
      require("moment-duration-format"); 
      let hesapkuruluş = new Date().getTime() - user.createdAt.getTime();  
      member.roles.add(sett.Roller.Kayıtsız)
      member.setNickname('• İsim | Yaş')

      if(hesapkuruluş > 172800) { var hesapkontrol = '**Hesap Durumun: Güvenilir!**' }
      if(hesapkuruluş < 172800) { var hesapkontrol = '**Hesap Durumun: Şüpheli!**' }
      moment.locale("tr");
      client.channels.cache.get(kanal).send(`• Hoşgeldin, ${member},
            
       • ${hesapkontrol},
      • Tagımızı Almayı Unutma: **${tag}**
      • Ses Odaların'dan Herhangi Birine Girerek Kayıt Olabilirsin!
      • Herhangi Bir Sorun Yaşarsan Yetkili Ekiplerimiz'e Bildirmeyi Unutma!
      • İçerde Keyifli Vakitler Geçirmeyi Unutma!`)
      })

      client.on("userUpdate", async (kinocshii) => {
      var sunucu = client.guilds.cache.get(sett.Önemli.SunucuİD);
      var uye = sunucu.members.cache.get(kinocshii.id);
      var tag = sett.Tags.Tag
      var tagrol = sett.Roller.Tagrol
      var logKanali = sett.Kanallar.GenalChat
      if (uye.user.tag.includes(tag)) { 
      uye.roles.add(tagrol)
      client.channels.cache.get(logKanali).send(`${uye}, İsimli Üye Tagımızı Aldı!`)
      } else {
      uye.roles.remove(tagrol)
      //uye.roles.set([tagrol]), taglı alım da iseniz bunu kullanın
      client.channels.cache.get(logKanali).send(`${üye}, İsimli Üye Tagımızı Bıraktı!`)
      }
      });

client.login(ayarlar.token);
