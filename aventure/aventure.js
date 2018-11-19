var combat = require('./combat');
var characterHelpers = require('./character');

module.exports = {
  startAventure: function(message, args)
  {
    characterHelpers.createCharacter(message);
  },
  
  progress: function(message, args)
  {
    var character = characterHelpers.getCharacter(message);
    if(character === undefined) { return; }
    
    if(character.combat === true)
    {
      if(combat.checkCombat(message, character))
      {
        combat.progressCombat(message, character);
      }
    }
    else
    {
    }
    
    characterHelpers.saveCharacter(character);
  },
  
  divinRestore: function(message)
  {
    var character = characterHelpers.getCharacter(message);
    if(character === undefined) { return; }
    
    if(character.divin > 0)
    {    
      characterHelpers.fullHeal(message, character);
    }
    else
    {
      message.channel.send('<@' + message.author.id + ">, Vous n'avez plus droit à l'aide de la déesse!");
    }
    
    characterHelpers.saveCharacter(character);
  },
  
  displayStatus: function(message)
  {
    var character = characterHelpers.getCharacter(message);
    if(character === undefined) { return; }
    characterHelpers.displayCharacter(message, character);
  },
  
  useChance: function(message, args)
  {
    var character = characterHelpers.getCharacter(message);
    if(character === undefined) { return; }
    
    if(character.combat === true)
    {
      combat.addChance(message, character, args);
    }
    characterHelpers.saveCharacter(character);
  }
}