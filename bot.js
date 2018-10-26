var Discord = require('discord.js');
var logger = require('winston');
var fs = require('fs');

var config = require('./conf.json');
var des = require('./des');
var update = require('./update');
var utils = require('./utils');
var divers = require('./divers');
var note = require('./note');

process.setMaxListeners(500);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.user.username + "-" + bot.user.id);
});

bot.on("guildMemberAdd", member =>   
{
  logger.info("Nouveau user : " + member.user.username);
  
  const guild = member.guild;
  guild.channels.get(config.welcomeChannelId).send("Bienvenue au nouveau membre de la communauté : " + member.user);
  
  var roleToAdd = utils.getRole(guild, 'Nouveau');
  logger.info("Adding role : " + roleToAdd + " which is " + roleToAdd.name + " to member : " + member.user.username);
  member.addRole(roleToAdd).catch(console.error);
});

bot.on('message', (message) =>
{
  logger.info(message.author.username + " dans le channel " + message.channel.name +  " - " + message.content);
  
  if(message.author.bot) { return; }
  if (message.content.startsWith(config.prefix)) {
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
     
    switch(command) {
      case 'command':
        message.channel.send("Les commandes disponibles sont \n        !lance : permet de lancer des dés. Exemple : !lance 3d7 \n        !time : permet de savoir depuis quand vous êtes sur le serveur \n        !rockiloli : permet de faire plaisir à un modo \n        !pannaautravail : permet de demander à l'autre modo de travailler \n        !tharn : permet de tester quelques rôles (modo, admin...)");
        break;
      case 'planning':
        if(message.author.id === config.plannerId)
        {
          message.guild.channels.get(config.planningChannelId).fetchMessage(config.planningMessageId)
          .then(calendar => {
            calendar.edit(args.join(' '));
          });
        }
        break;
      case 'tharn':
        divers.testMainRole(message);
        break;
      case 'pannaautravail':
        message.channel.send('Pannaistes retourne bosser ! https://gph.is/1Fbp1e6');
        break;
      case 'rockiloli':
        message.channel.send('La loli de Le Rocki ! ' + divers.loliFromRocki());
        break;
      case 'testnotif':
        var textToSend = '<@' + message.author.id + '> test de notif';
        message.channel.send(textToSend);
        break;
      case 'lance':
        message.channel.send(des.lanceDes(args));
        break;
      case 'time':
        update.time(message);
        break;
      case 'update':
        update.update(message, args);
        break;
      case 'checkupdate':
        update.checkUpdate(message, args);
        break;
      case 'note':
        note.handleNote(message, args);
        break;
      case 'write':
        fs.writeFile('/data/test', args.join(" "), function(err) {
          if(err) {
            return logger.info(err);
          }

          logger.info("The file was saved!");
        }); 
        break;
      case 'read':
        fs.readFile('/data/test', 'utf8', function(err, data) {  
          if (err) { logger.error("read failed: " + err); }
          else { message.channel.send("Le message sauvegardé est : " + data); }
        });
        break;
  
      // Just add any case commands if you want to..
     }
   }
});

bot.login(process.env.auth);