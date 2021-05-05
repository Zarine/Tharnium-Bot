var fs = require('fs');
var logger = require('winston');
var config = require('./conf.json');

var loliFile = config.baseLocation + 'loli.json';

var voteList = { "🇦":"Miss Midi-Pyrénées", "🇧":"Miss Poitou-Charentes", "🇨":"Miss Normandie", "🇩":"Miss Aquitaine", "🇪":"Miss Île-de-France", "🇫":"Miss Nord-Pas-de-Calais", "🇬":"Miss Picardie", "🇭":"Miss Guyane", "🇮":"Miss Martinique", "🇯":"Miss Bretagne", "🇰":"Miss Pays de la Loire", "🇱":"Miss Centre Val de Loire", "🇲":"Miss Bourgogne", "🇳":"Miss Limousin", "🇴":"Miss Guadeloupe", "🇵":"Miss Champagne-Ardenne", "🇶":"Miss Provence", "🇷":"Miss Mayotte", "🇸":"Miss Corse", "🇹":"Miss Lorraine", "🇺":"Miss Alsace", "🇻":"Miss Tahiti", "🇼":"Miss Saint-Martin/Saint-Barthélémy", "🇽":"Miss Côte d'Azur", "🇾":"Miss Languedoc-Roussillon", "🇿":"Miss Franche-Comté", "1":"Miss Réunion", "2":"Miss Nouvelle-Calédonie", "3":"Miss Auvergne", "4":"Miss Rhône-Alpes" };

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

function unique(arr) {
    var u = {}, a = [];
    for(var i = 0, l = arr.length; i < l; ++i){
        if(!u.hasOwnProperty(arr[i])) {
            a.push(arr[i]);
            u[arr[i]] = 1;
        }
    }
    return a;
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
  
  rollGiveAway: function(message, args) {
    
    var allowed = false;
    message.member.roles.cache.forEach(function(ownedRole) {
      if(ownedRole.name === 'Zarine') { allowed = true; }
    });
    
    if(allowed)
    {
      var giveAwayMessageId = args[0];
      if(giveAwayMessageId !== undefined)
      {
        message.guild.channels.cache.get('298328195172663297').messages.fetch(giveAwayMessageId)
        .then(giveAwayMessage => {

          var reactionList = [];
          giveAwayMessage.reactions.cache.forEach(function(reaction) {
            reactionList.push(reaction);
          });
            
          for(var i = 0; i < reactionList.length; i++)
          {
            var currentReaction = reactionList[i];
			console.log(currentReaction);
            var userList = []
			currentReaction.users.fetch()
			.then(users => {
				users.forEach((value,key)=>{
				  userList.push(value);
				})
			});
            
            var filteredList = unique(userList);
            
            var winner = filteredList[Math.floor(Math.random() * filteredList.length)];
            
            var result = 'Le gagnant est: <@' + winner.id + '>';
            message.channel.send(result);
          }
        });
      }
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