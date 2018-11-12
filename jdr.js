var fs = require('fs');
var logger = require('winston');
var config = require('./conf.json');

function getFileName(message)
{
  return (config.baseLocation + "jdr" + message.channel.id + ".json");
}

function updateNumericValue(value, update)
{
  if(update.startsWith('+')) 
  {
    var update = update.slice(1);
    return value + parseInt(update, 10);
  }
  else if(update.startsWith('-')) 
  {
    var update = update.slice(1);
    return value - parseInt(update, 10);
  }
  else if(update.startsWith('*')) 
  {
    var update = update.slice(1);
    return Math.round((value * parseFloat(update, 10)));
  }
  else if(update.startsWith('/')) 
  {
    var update = update.slice(1);
    return Math.round((value / parseInt(update, 10)));
  }
  else 
  {
    var update = parseInt(update, 10);
    return update;
  }
}

function getData(message)
{
    var data;
    try {
      data = fs.readFileSync(getFileName(message), 'utf8');
    }
    catch(err)
    {  
      message.channel.send('<@' + message.author.id + '>, le channel ' + message.channel + " n'est pas initialisé pour le jdr.");
      return undefined;
    }
    
    return JSON.parse(data);
}

function createCharacter()
{
  var character = {};
  character.name = "No Name"
  character.cash = 0;
  character.hp = 0;
  character.hpmax = 0;
  character.mp = 0;
  character.mpmax = 0;
  character.xp = 0;
  character.level = 1;
  character.inventory = [];
  character.freeData = [];
  return character;
}

module.exports = {
  init: function(message, args)
  {
    var gameStatus = {};
    gameStatus.playerList = {};
    gameStatus.characterList = {};
    gameStatus.gameMaster = message.member.id;
    
    fs.writeFile(getFileName(message), JSON.stringify(gameStatus), function(err) 
    {
      if(err) { message.channel.send('<@' + message.author.id + ">, échec de l'init !"); }
      else { message.channel.send('<@' + message.author.id + '>, le channel ' + message.channel + " est prêt pour le jdr"); }
    });
  },
  
  addPlayer: function(message, args)
  {
    var jsonData = getData(message);
    if(jsonData === undefined) { return; }
    
    if(args.length !== 2)
    {
      message.channel.send('<@' + message.author.id + '>, usage est : !addplayer alias @utilisateur');
      return;
    }
    
    var idMention = message.mentions.members.first().id;
    jsonData.playerList[args[0]] = idMention;
    
    if(jsonData.characterList[idMention] === undefined)
    {
      jsonData.characterList[idMention] = createCharacter();
    }
    
    fs.writeFile(getFileName(message), JSON.stringify(jsonData), function(err) 
    {
      if(err) { message.channel.send('<@' + message.author.id + ">, échec de l'init !"); }
      else { message.channel.send('<@' + message.author.id + '>, le joueur  ' + args[0] + " est bien enregistré pour le jdr"); }
    });
    logger.info(jsonData);
  },
  
  displayCharacter: function(message, args)
  {
    if(args.length > 1)
    {
      message.channel.send('<@' + message.author.id + '>, usage est : !displayPlayer [alias]');
      return;
    }
    
    var jsonData = getData(message);
    if(jsonData === undefined) { return; }
    
    var id;
    if(args.length === 0) { id = message.member.id; }
    else { id = jsonData.playerList[args[0]]; }
    
    if(id === undefined)
    {
      message.channel.send('<@' + message.author.id + '>, cet alias est inconnu !');
    }
    else
    {
      var character = jsonData.characterList[id];
      var textToSend = [];
      textToSend.push('<@' + message.author.id + '>, ');
      textToSend.push('le personnage se nomme ' + character.name + '. ');
      textToSend.push('Il est niveau ' + character.level + '.\n');
      textToSend.push('HP: ' + character.hp + "/" + character.hpmax + '\n');
      textToSend.push('MP: ' + character.mp + "/" + character.mpmax + '\n');
      textToSend.push('Pièces d\'or: ' + character.cash);
      message.channel.send(textToSend.join(''));
    }
  },
  
  setName: function(message, args)
  {
    var jsonData = getData(message);
    if(jsonData === undefined) { return; }
    
    if(args.length === 0)
    {
      message.channel.send('<@' + message.author.id + '>, usage est : !setName Nom du Personnage');
      return;
    }
    
    var id = message.member.id;
    jsonData.characterList[id].name = args.join(' ');
    
    fs.writeFile(getFileName(message), JSON.stringify(jsonData), function(err) 
    {
      if(err) { message.channel.send('<@' + message.author.id + ">, échec de la mise à jour du nom !"); }
      else { message.channel.send('<@' + message.author.id + '>, le nom de votre personne est maintenant: ' + jsonData.characterList[id].name); }
    });
    logger.info(jsonData);
  },
  
  changeHP(message, args)
  {
    if(args.length < 2)
    {
      message.channel.send('<@' + message.author.id + '>, usage est : !hp alias changement');
      return;
    }
    
    var jsonData = getData(message);
    if(jsonData === undefined) { return; }
    var id = jsonData.playerList[args[0]];;
    
    if(id === undefined)
    {
      message.channel.send('<@' + message.author.id + '>, cet alias est inconnu !');
    }
    else
    {
      var textToSend = [];
      var character = jsonData.characterList[id];
      textToSend.push('HP: ' + character.hp + "/" + character.hpmax + ' => ');
      
      var change = args[1];
      
      character.hp = updateNumericValue(character.hp, change);
      if(character.hp > character.hpmax) { character.hp = character.hpmax; }
      
      textToSend.push(character.hp + "/" + character.hpmax);
      
      fs.writeFile(getFileName(message), JSON.stringify(jsonData), function(err) 
      {
        if(err) { message.channel.send('<@' + message.author.id + ">, échec de la mise à jour des HP !"); }
        else { message.channel.send(textToSend.join('')); }
      });
    }
  },

  changeHPmax(message, args)
  {
    if(args.length < 2)
    {
      message.channel.send('<@' + message.author.id + '>, usage est : !hpmax alias changement');
      return;
    }
    
    var jsonData = getData(message);
    if(jsonData === undefined) { return; }
    var id = jsonData.playerList[args[0]];;
    
    if(id === undefined)
    {
      message.channel.send('<@' + message.author.id + '>, cet alias est inconnu !');
    }
    else
    {
      var textToSend = [];
      var character = jsonData.characterList[id];
      var change = args[1];
      
      textToSend.push('HP avant: ' + character.hp + "/" + character.hpmax + '\n');

      character.hpmax = updateNumericValue(character.hpmax, change);
      if(character.hp > character.hpmax) { character.hp = character.hpmax; }
      
      textToSend.push('HP maintenant: ' + character.hp + "/" + character.hpmax);
      
      fs.writeFile(getFileName(message), JSON.stringify(jsonData), function(err) 
      {
        if(err) { message.channel.send('<@' + message.author.id + ">, échec de la mise à jour des HP max !"); }
        else { message.channel.send(textToSend.join('')); }
      });
    }
    
  }
}