var config = require('./conf.json');
var commands = require('./commands.json');

module.exports = {
  getCommand: function(message)
  {
    var textToDisplay = [];
    textToDisplay.push("Les commandes disponibles sont:\n");
    
    var commandList = commands.commandList;
    for(var i = 0; i < commandList.length; i++)
    {
      var currentCommand = commandList[i];
      textToDisplay.push(currentCommand.name, ": ", currentCommand.description);
      
      if(currentCommand.example !== undefined)
      {
        textToDisplay.push(" Exemple: ", config.prefix ,currentCommand.example);
      }
      textToDisplay.push("\n");
      
    }
    
    message.channel.send(textToDisplay.join());
  }
}