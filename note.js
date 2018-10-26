var fs = require('fs');
var logger = require('winston');

module.exports = {
  handleNote: function(message, args)
  {
    var userId = message.member.id;
    var noteFile = '/data/note.json';
    
    fs.readFile(noteFile, 'utf8', function(err, data) {  
      if (err) { 
        logger.error("read failed: " + err); 
        data = "{}";
      }
      logger.info("the file contain: " + data);
      
      var jsonData = JSON.parse(data);
      
      if(args.length === 0)
      {
        var userNote = jsonData[message.member.id];
        if(userNote === undefined)
        {
          message.channel.send('<@' + message.author.id + '>, je ne trouve pas de note pour vous !');
        }
        else
        {
          message.channel.send('<@' + message.author.id + ">, voici ce que j'ai en memoire venant de vous: \n" + userNote);
        }
      }
      else
      {
        jsonData[message.member.id] = args.join(" ");
        
        fs.writeFile(noteFile, JSON.stringify(jsonData), function(err) {
          if(err) {
            message.channel.send('<@' + message.author.id + ">, vous avez tout cassé !");
            return;
          }

          message.channel.send('<@' + message.author.id + ">, j'ai sauvegardé pour vous ce message: \n" + jsonData[message.member.id]);
        }); 
      }
    });

    
  },
  
  clearNote: function(message, args)
  {
    fs.writeFile(noteFile, "{}", function(err) {
      if(err) { message.channel.send('<@' + message.author.id + ">, vous avez tout cassé !"); }
    });
  }
}