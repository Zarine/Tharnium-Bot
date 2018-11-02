var fs = require('fs');
var logger = require('winston');
var config = require('./conf.json');

var loliFile = config.baseLocation + 'loli.json';

var voteList = { "🇦":"Miss Midi-Pyrénées" }

function addLoliToFile(message, args)
{
  fs.readFile(loliFile, 'utf8', function(err, data) {  
    if (err) { 
      logger.error("read failed: " + err); 
      data = '{ "loli": [] }';
    }
  
    var jsonData = JSON.parse(data);
  
    jsonData.loli.push(args.join(" "));
      
    fs.writeFile(loliFile, JSON.stringify(jsonData), function(err) {
      if(err) {
        message.channel.send('<@' + message.author.id + ">, vous avez tout cassé !");
        return;
      }

      message.channel.send('Loli ajouté: ' + args.join(" "));
    }); 
  });
}

function readLoli(message)
{
  fs.readFile(loliFile, 'utf8', function(err, data) {  
    if (err) { 
      logger.error("read failed: " + err); 
      data = '{ "loli": [] }';
    }

    var loliList = JSON.parse(data).loli;
    message.channel.send('La loli de Le Rocki ! ' + loliList[Math.floor((Math.random() * loliList.length))]);
  });
}


module.exports = {
  testMainRole: function(message) {
    if(message.member.roles.find("name", "Zarine"))
    {
      if(message.author.username === "Zarinette") 
      {
        message.channel.send('Oui maîtresse ? Que puis-je pour vous ?');
      }
      else {
        message.channel.send('Oui maître ? Que puis-je pour vous ?');
      }
    }
    else if(message.member.roles.find("name", "Modo"))
    {
      message.channel.send('Oui modo ? Que puis-je pour vous ?');
    }
    else
    {
      message.channel.send('Tu crois quoi mon petit ?');
    }
  },
  
  loliFromRocki: function(message)
  {
    return readLoli(message);
  },
  
  addLoli: function(message, args)
  {
    if(message.member.id === '255776985760923649' || message.member.id === '174628488538619904')
    {
      addLoliToFile(message, args);
    }
  },
  
  printReaction: function(message, reaction)
  {
    if(reaction.count === 1) { return; }
    reaction.fetchUsers()
    .then(users => {
      var listUser = [];
      
      users.forEach(function(user)
      {
        if(user.username !== 'Zarine')
        {
          listUser.push(user.username);
        }
      });
      var result = "";
      if(voteList[reaction.emoji] !== undefined)
      {
        result = voteList[reaction.emoji] + " : " + (reaction.count - 1) + " vote(s) de: " + listUser.join(', ') + '\n';
      }
      else
      {
        result = reaction.emoji + " : " + (reaction.count - 1) + " vote(s) de: " + listUser.join(', ') + '\n';
      }
      message.channel.send(result);
    });
  }
}