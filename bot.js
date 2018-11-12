var Discord = require('discord.js');
var logger = require('winston');
var fs = require('fs');

var config = require('./conf.json');
var des = require('./des');
var update = require('./update');
var utils = require('./utils');
var divers = require('./divers');
var note = require('./note');
var jdr = require('./jdr');
var commandHelp = require('./commandHelp');

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
    
    if(args[0].match(/^\d/)) // start with a number
    {
      message.channel.send(des.lanceDes(args));
      return;
    }
    
    const command = args.shift().toLowerCase();
     
    switch(command) {
      case 'command':
        commandHelp.getCommand(message);
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
      case 'panna':
        message.channel.send('Pannaistes retourne bosser ! https://gph.is/1Fbp1e6');
        break;
      case 'rocki':
        divers.loliFromRocki(message);
        break;
      case 'addloli':
        divers.addLoli(message, args)
        break;
      case 'testnotif':
        var textToSend = '<@' + message.author.id + '> test de notif';
        message.channel.send(textToSend);
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
      case 'clearnote':
        if(message.author.id === config.plannerId)
        {
          note.clearNote(message, args);
        }
        break;
      case 'initjdr':
        jdr.init(message, args);
        break;
      case 'addplayer':
        jdr.addPlayer(message, args);
        break;
      case 'displaycharacter':
        jdr.displayCharacter(message, args);
        break;
      case 'name':
        jdr.setName(message, args);
        break;
      case 'hp'
        jdr.changeHP(message, args);
        break;
      case 'hpmax':
        jdr.changeHPmax(message, args);
        break;
      case 'vote':
        
        message.guild.channels.get('506213246739415060').fetchMessage('506214334293213195')
        .then(firstMessage => {

          message.guild.channels.get('506213246739415060').fetchMessage('506214739316047872')
          .then(secondMessage => {
            var reactionList = [];
            firstMessage.reactions.forEach(function(reaction) {
              reactionList.push(reaction);
            });
            secondMessage.reactions.forEach(function(reaction) {
              reactionList.push(reaction);
            });
            
            for(var i = 0; i < reactionList.length; i++)
            {
              var currentReaction = reactionList[i];
              divers.printReaction(message, currentReaction);
            }
          });
        })
        break;
     }
   }
});

bot.login(process.env.auth);