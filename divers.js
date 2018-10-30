var fs = require('fs');
var logger = require('winston');
var config = require('./conf.json');

var loliFile = config.baseLocation + 'loli.json';

var rockiList = ["https://cdn.discordapp.com/attachments/314187897391808512/505137602383446064/telechargement_9.jpg", "https://cdn.discordapp.com/attachments/314187897391808512/505137622738403368/twqr.jpg", "https://cdn.discordapp.com/attachments/314187897391808512/505137623128473640/9813427e24cc65df0d0e13fc6d4665e3.jpg", "https://cdn.discordapp.com/attachments/314187897391808512/505137623669407745/catgirl.png", "https://cdn.discordapp.com/attachments/314187897391808512/505137623065559040/gweqt.jpg", "https://cdn.discordapp.com/attachments/314187897391808512/505137635694608385/tumblr_p2etnmg1C11wt7ek9o1_500.jpg", "https://cdn.discordapp.com/attachments/314187897391808512/505137636218896406/0281dcb77935a84c607baeb5c58e029a.jpg", "https://cdn.discordapp.com/attachments/314187897391808512/505137647006777355/tumblr_mrzwnzhhWj1s4qvrdo1_500.gif", "https://cdn.discordapp.com/attachments/314187897391808512/505137697900462090/Dm59C0MWwAAmLX_.png", "https://cdn.discordapp.com/attachments/314187897391808512/505137724471246874/thumb-1920-792522.png", "https://cdn.discordapp.com/attachments/314187897391808512/505137790388797460/tumblr_nxc2q8tYkT1tydz8to1_500.gif", "https://cdn.discordapp.com/attachments/314187897391808512/505137794952200212/tumblr_olt0rjd8en1twgfw0o1_500.gif", "https://cdn.discordapp.com/attachments/314187897391808512/505137827483353088/iHcpRep.gif", "https://cdn.discordapp.com/attachments/314187897391808512/505137873419370501/abbd0649fffb1b97d3a8b530b9da5f50f6410465_hq.gif", "https://cdn.discordapp.com/attachments/314187897391808512/505137893283463168/tmCDi1h.gif", "https://cdn.discordapp.com/attachments/314187897391808512/505137912904548353/9d2.gif", "https://cdn.discordapp.com/attachments/314187897391808512/505138255000502302/tumblr_mrtyc42YJG1s13f2io1_500.gif", "https://cdn.discordapp.com/attachments/314187897391808512/505138600212561930/2fbdef928f3458d229d728cffd36eed3.jpg"];

function addLoliToFile(message)
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

function readLoli()
{
  fs.readFile(loliFile, 'utf8', function(err, data) {  
    if (err) { 
      logger.error("read failed: " + err); 
      data = '{ "loli": [] }';
    }
  
    var loliList = JSON.parse(data).loli;
    return loliList[Math.floor((Math.random() * loliList.length))];
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
  
  loliFromRocki: function()
  {
    return readLoli();
  },
  
  addLoli: function(message)
  {
    if(message.member.id === '255776985760923649' || message.member.id === '174628488538619904')
    {
      addLoliToFile(message);
    }
  }
}