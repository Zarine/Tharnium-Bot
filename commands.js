var logger = require('winston');

var config = require('./conf.json');
var des = require('./des');
var divers = require('./divers');
var update = require('./update');
var commandHelp = require('./commandHelp');
var guessGame = require('./guessGame');

module.exports = {
  handleCommand: function(message)
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
        case 'roll':
          divers.rollGiveAway(message, args);
          break;
        case 'notif':
          update.addNotif(message, args);
          break;
        case 'stopnotif':
          update.removeNotif(message, args);
          break;
        case 'panna':
          message.channel.send('Pannaistes retourne bosser ! https://media4.giphy.com/media/j4LYyhtYVh8Q/giphy.gif');
          break;
        case 'pana':
          message.channel.send('Panadrame retourne bosser ! https://media.tenor.com/images/6cbdb065ab82b233d4a301d2ba63f9a0/tenor.gif');
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
        case 'devine':
          guessGame.guessGame(message, args);
          break;
        case 'devinescore':
          guessGame.score(message, args);
          break;
      }
    }
  }
}
