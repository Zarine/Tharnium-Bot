var logger = require('winston');

var config = require('./conf.json');
var des = require('./des');
var divers = require('./divers');
var update = require('./update');
var note = require('./note');
var jdr = require('./jdr');
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
        case 'panna':
          message.channel.send('Pannaistes retourne bosser ! https://media1.giphy.com/media/jqfkQJr35LBYZdHDXH/giphy.gif');
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
        case 'hp':
          jdr.changeHP(message, args);
          break;
        case 'hpmax':
          jdr.changeHPmax(message, args);
          break;
        case 'devine':
          guessGame.guessGame(message, args);
          break;
        case 'devinescore':
          guessGame.score(message, args);
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
  }
}
