module.exports = {
  handleNote: function(message, args)
  {
    var userId = message.member.id;
    var noteFile = '/data/note.json';
    
    fs.readFile('noteFile', 'utf8', function(err, data) {  
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
          message.channel.send('<@' + message.author.id + ">, voici ce que j'ai en memoire venant de vous: " + userNote);
        }
      }
      else
      {
        jsonData[message.member.id] = args.join(" ");
        
        fs.writeFile(noteFile, JSON.stringify(jsonData), function(err) {
          if(err) {
            logger.info('<@' + message.author.id + ">, vous avez tout cassé !");
            return;
          }

          logger.info('<@' + message.author.id + ">, j'ai sauvegardé pour vous ce message: " + jsonData[message.member.id]);
        }); 
      }
    });

    
  }
}