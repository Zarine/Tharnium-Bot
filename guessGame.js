var CurrentNumber = 0;
var found = true;
var lastPlayer = "";

var score = {};

module.exports = {
  guessGame: function(message, args)
  {
    if(args.length != 1)
    {
      message.channel.send('<@' + message.author.id + '>, la commande est : ?devine nombre');
      return;
    }
    
    if(lastPlayer === message.author.id)
    {
      message.channel.send('<@' + message.author.id + '>, vous devez attendre qu\'un autre joueur tente de trouver!');
      return;
    }
    lastPlayer = message.author.id;
    
    var response = [];
    response.push('<@' + message.author.id + '>, ');
    if(found === true)
    {
      response.push('une nouvelle partie est lancée! Il faut trouver le nombre entre 1 et 1000\n');
      found = false;
      CurrentNumber = Math.floor((Math.random() * 1000) + 1);
    }
    
    var value = parseInt(args[0], 10);
    
    if(value < CurrentNumber)
    {
      response.push('Le nombre a trouver est plus grand');
    }
    else if(value > CurrentNumber)
    {
      response.push('Le nombre a trouver est plus petit');
    }
    else
    {
      response.push('Vous avez trouver le bon nombre! Félicitation!');
      found = false;
      lastPlayer = "";
      
      if(score[message.author.id] === undefined)
      {
        score[message.author.id] = {};
        score[message.author.id].score = 1;
      }
      else
      {
        score[message.author.id].score += 1;
        
      }
      score[message.author.id].name = message.author.username; // set or update the player name
    }
    
    message.channel.send(response.join(''));

  },
  
  score: function(message, args)
  {
    var response = [];
    response.push('Le tableau des scores est le suivant:');
    
    Object.keys(score).forEach( function(key) {
      player = score[key];
      response.push(player.name + ' avec ' + player.score + ' point(s)');
    });
    message.channel.send(response.join('\n'));
  }
}