
function battleRound(message, character, monster)
{
  var rollHabilityA = Math.floor((Math.random() * 6) + 1);
  var rollHabilityB = Math.floor((Math.random() * 6) + 1);
  
  var rollMonsterHabilityA = Math.floor((Math.random() * 6) + 1);
  var rollMonsterHabilityB = Math.floor((Math.random() * 6) + 1);
  
  var habilityCharacter = character.hability + rollHabilityA + rollHabilityB;
  var habilityMonster = monster.hability + rollMonsterHabilityA + rollMonsterHabilityB;
  
  var result = [];
  result.push('<@' + message.author.id + '>, lors de cette phase de combat, vous avez:');
  result.push('Force d\'attaque: ' + habilityCharacter + ' - base: ' + character.hability + ', dés: ' + rollHabilityA + ' + ' + rollHabilityB);
  result.push('Le monstre lui a:');
  result.push('Force d\'attaque: ' + habilityMonster + ' - base: ' + monster.hability + ', dés: ' + rollMonsterHabilityA + ' + ' + rollMonsterHabilityB);
  
  if(habilityCharacter > habilityMonster)
  {
    result.push('Vous avez la supériorité et vous le blessez!');
    monster.endurance -= 2;
    character.hit = -2;
    result.push('Sans utilisez de la chance, il lui resterait: ' + habilityMonster.endurance + ' endurance.');
  }
  else if(habilityCharacter < habilityMonster)
  {
    result.push('Il a la supériorité et il vous blesse:');
    character.endurance -= 2;
    character.hit = 2;
    result.push('Sans utilisez de la chance, il vous resterait: ' + character.endurance + ' endurance.');
  }
  else
  {
    result.push('Aucun de vous n\'arrive à toucher l\'autre');
    character.hit = 0;
  }
  
  message.channel.send(result.join('\n'));
}

function chanceHandling(message, character, monster, value)
{
  // This is not how chance should work for combat, but that's something ! 
  if(character.hit === 0) 
  {
    message.channel.send('<@' + message.author.id + ">, La chance ne peut plus rien changer!");
    return;
  }
  
  if(character.hit > 0)
  {
    if(value > character.hit) { value = character.hit; }
    if(value > character.luck)
    {
      message.channel.send('<@' + message.author.id + ">, il ne vous reste que " + character.luck ' point(s) de chance' );
      return;
    }
    character.endurance += value;
    character.luck -= value;
    character.hit -= value;
  }
  else
  {
    var absHit = Math.abs(character.hit);
    if(value > absHit) { value = absHit; }
    if(value > character.luck)
    {
      message.channel.send('<@' + message.author.id + ">, il ne vous reste que " + character.luck ' point(s) de chance' );
      return;
    }
    monster.endurance -= value;
    character.luck -= value;
    character.hit += value;
  }
}


module.exports = {
  progressCombat: function(message, character)
  {
    var monster = character.firstMonster;
    battleRound(message, character, monster);
  },
  
  checkCombat: function(message, character)
  {
    if(character.endurance < 1)
    {
      message.channel.send('<@' + message.author.id + ">, Vous êtes mort au combat!");
      character = undefined;
      return false;
    }

    var monster = character.firstMonster;    
    if(monster.endurance < 1)
    {
      var result = [];
      result.push('<@' + message.author.id + ">, Vous avez tué le monstre: " + monster.name);
      
      if(character.secondMonster !== undefined)
      {
        character.firstMonster = character.secondMonster;
        character.secondMonster = character.thirdMonster;
        character.thirdMonster = undefined;
        character.hit = 0;
        result.push("Au tour du monstre suivant: " + character.firstMonster.name);
        message.channel.send(result.join('\n'));
      }
      else
      {
        character.combat = false;
        character.hit = 0;
        message.channel.send(result.join('\n'));
        return false;
      }
    }
    
    return true;
  },
  
  addChance: function(message, character, args)
  {
    if(args[0] === undefined)
    {
      message.channel.send('<@' + message.author.id + ">, Il faut ajouter combien de points vous voulez utiliser");
      return;
    }
    if(character.combat === false)
    {
      message.channel.send('<@' + message.author.id + ">, Vous n'êtes pas en combat!");
      return;
    }
    
    var value = parseInt(args[0], 10)    
    var monster = character.firstMonster;
    chanceHandling(message, character, monster, value);
  }
}