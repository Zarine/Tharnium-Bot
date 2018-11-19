var fs = require('fs');
var logger = require('winston');
var config = require('../conf.json');
var aventureConfig = require('./conf.json');

function getAdventureFileName(message)
{
  return (config.baseLocation + aventureConfig.avantureLocation + "characters" + message.channel.id + ".json");
}

function getData(message)
{
    var data;
    try {
      data = fs.readFileSync(getAdventureFileName(message), 'utf8');
    }
    catch(err)
    {  
      return undefined;
    }
    return JSON.parse(data);
}

function buildCharacter(message)
{
    var habilite = Math.floor((Math.random() * 6) + 1);
    var enduranceA = Math.floor((Math.random() * 6) + 1);
    var enduranceB = Math.floor((Math.random() * 6) + 1);
    var chance = Math.floor((Math.random() * 6) + 1);
    
    var totHabilite = habilite + 6;
    var totEndurance = enduranceA + enduranceB + 12;
    var totChance = chance + 6;
    
    var result = [];
    result.push('<@' + message.author.id + '>, vous avez tiré les dés 6 suivants:');
    result.push('Habilité: ' +  habilite);
    result.push('Endurance: ' +  enduranceA + ' + ' + enduranceB)
    result.push('Chance: ' +  chance);
    result.push('En ce début de partie, vos caractéristiques sont donc:');
    result.push('Habilité / Combat: ' +  totHabilite);
    result.push('Endurance / Résistance: ' +  totEndurance)
    result.push('Chance: ' +  totChance);
    
    message.channel.send(result.join('\n'));
    
    var character = {};
    character.startHability = totHabilite;
    character.startEndurance = totEndurance;
    character.startLuck = chance;
    character.hability = totHabilite;
    character.endurance = totEndurance;
    character.luck = chance;
    character.step = 1;
    character.combat = false;
    character.firstMonster = {};
    character.secondMonster = {};
    character.hit = 0;
    character.provisions = 2;
    character.divin = 1;
    character.gold = 20;
    return character;
}


module.exports = {
  createCharacter: function(message)
  {
    var character = buildCharacter(message);
    var jsonData = getData(message);
    if(jsonData === undefined) { jsonData = {}; }
    
    jsonData[message.author.id] = character;
    
    fs.writeFile(getFileName(message), JSON.stringify(jsonData), function(err) 
    {
      if(err) { message.channel.send('<@' + message.author.id + ">, échec de l'enregistrement du personnage!"); }
    });
    
  },
  
  getCharacter: function(message)
  {
    var jsonData = getData(message);
    if(jsonData === undefined) 
    {
      message.channel.send('<@' + message.author.id + ">, absolument aucune sauvegarde existe actuellement.");
      return undefined;
    }
    
    var character = jsonData[message.author.id];
    
    if(character === undefined)
    {
      message.channel.send('<@' + message.author.id + ">, vous n'avez pas de personnage. Il faut commencer par demarrer le jeu");
      return undefined;
    }
    
    return character;
  },
  
  saveCharacter: function(message, character)
  {
    fs.writeFile(getFileName(message), JSON.stringify(character), function(err) 
    {
      if(err) { message.channel.send('<@' + message.author.id + ">, échec de l'enregistrement du personnage!"); }
    });
  },
  
  fullHeal(message, character)
  {
    character.hability = character.startHability;
    character.endurance = character.startEndurance;
    character.luck = character.startLuck;
    character.divin -= 1;
    displayCharacter(message, character);
  }
  
  displayCharacter: function(message, character)
  {
  }
}