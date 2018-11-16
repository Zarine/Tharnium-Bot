var CurrentNumber = 0;
var found = true;

var score = {};

module.exports = {
  guessGame: function(message, args)
  {
    if(args.length != 1)
    {
      message.channel.send('<@' + message.author.id + '>, la commande est : ?devine nombre');
      return;
    }
    
    var response = [];
    response.push('<@' + message.author.id + '>, ');
    if(found = true)
    {
      response.push('une nouvelle partie est lancée! Il faut trouver le nombre entre 1 et 1000\n');
      found = false;
      CurrentNumber = Math.floor((Math.random() * 1000) + 1);
    }
    
    var value = parseInt(args[0], 10);
    
    if(value < CurrentNumber)
    {
      response.push('Le nombre a trouvé est plus grand');
    }
    else if(value > CurrentNumber)
    {
      response.push('Le nombre a trouvé est plus petit');
    }
    else
    {
      response.push('Vous avez trouvé le bon nombre! Félicitation!');
      found = false;
    }
    
    message.channel.send(response.join(''));

  }
}