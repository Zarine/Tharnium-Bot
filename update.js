var logger = require('winston');

var utils = require('./utils');

function checkModoOrZarine(member)
{
  var result = false;
  member.roles.forEach(function(ownedRole) {
    if(ownedRole.name === 'Zarine' || ownedRole.name === 'Modo') { result = true; }
  });
  return result;
}

function setNouveauRole(member, args, result)
{
  var mustUpdate = true;
  const guild = member.guild;
  member.roles.forEach(function(ownedRole) {
    if(ownedRole.name === 'Compagnon' || ownedRole.name === 'Nouveau') { mustUpdate = false; }
  });
  
  if(mustUpdate)
  {
    var roleToAdd = utils.getRole(guild, 'Nouveau');
    logger.info("Adding role : " + roleToAdd + " which is " + roleToAdd.name + " to member : " + member.user.username);
    member.addRole(roleToAdd).then( () => { upgradeNouveau(member, args, result); } ).catch(console.error);
    result.push(member.user.username + " n'avait pas de role. Le bon role lui a été donné !");
    
  }
}

function checkJoinDateLimit(member)
{
  var diff = Date.now() - member.joinedTimestamp - (3 * 24 * 60 * 60 * 1000);
  if(diff < 0) { return false; }
  return true;
}

function nouveauToCompagnon(guild, member, result)
{
  var compagnon = utils.getRole(guild, 'Compagnon');
  member.addRole(compagnon).catch(console.error);
  
  var nouveau = utils.getRole(guild, 'Nouveau');
  member.removeRole(nouveau).catch(console.error);
  
  result.push(member.user.username + " vient de passer Compagnon !");
}

function upgradeNouveau(member, args, result)
{
  const guild = member.guild;
  member.roles.forEach(function(ownedRole) {
    if(ownedRole.name === 'Nouveau') 
    {
      if(!checkJoinDateLimit(member)) { logger.info(member.user.username + " est trop jeune sur le serveur pour un changement de role"); }
      else { nouveauToCompagnon(guild, member, result); }
    }
  });
}

function checkNouveauRole(member, args, result)
{
  var hasRole = false;
  member.roles.forEach(function(ownedRole) {
    
    if(ownedRole.name === 'Nouveau') 
    {
      hasRole = true;
      var joinDate = new Date(member.joinedTimestamp);
      var textToAdd = member.user.username + " est toujours un Nouveau. Il est sur le serveur depuis le : " + joinDate.getDate() + "/" + (joinDate.getMonth() + 1 + "/" + joinDate.getFullYear()) ;
      result.nouveauUser.push(textToAdd);
      
      if(checkJoinDateLimit(member))
      {
        result.upgradeUser.push(member.user.username);
      }
    }
    
    if(ownedRole.name === 'Compagnon')
    {
      hasRole = true;
    }      
  });
  
  if(!hasRole) { result.missingRole.push(member.user.username); }
}

module.exports = {
  update: function(message, args) {
    if(!checkModoOrZarine(message.member)) {
      message.channel.send("Vous n'utiliserez pas CA !");
      return;
    }
    
    message.guild.fetchMembers().then( guild => {
      var result = [];
      guild.members.forEach(function(member) {
        setNouveauRole(member, args, result);
        upgradeNouveau(member, args, result);
      });
      if(result.length !== 0) 
      {
        message.channel.send(result.join("\n"));
      }
      else 
      {
        message.channel.send("Rien a faire !");
      }
    });
  },
  
  checkUpdate: function(message, args) {
    if(!checkModoOrZarine(message.member)) {
      message.channel.send("Vous n'utiliserez pas CA !");
      return;
    }
    
    var result = { 'nouveauUser': [], 'upgradeUser': [], 'missingRole': []};
    message.guild.fetchMembers().then( guild => {
      guild.members.forEach(function(member) {
        checkNouveauRole(member, args, result);
      });
      
      if(result.nouveauUser.length === 0 && result.missingRole.length === 0) 
      {
        message.channel.send("Aucune update a faire : tout est bon !");
      }
      
      var messageToSend = "";
      if(result.nouveauUser.length !== 0)
      {
        messageToSend = "Il y a actuellement les Nouveaux suivant : \n" + result.nouveauUser.join("\n") + "\n Ca fait " + result.nouveauUser.length + " Nouveau\n";
        
      }
      if(result.upgradeUser.length !== 0)
      {
        messageToSend += "Les utilisateurs suivant peuvent passer automatiquement Compagnon:\n" + result.upgradeUser.join("\n") + "/n";
      }
      if(result.missingRole.length !== 0)
      {
        messageToSend += "Les utilisateurs ne sont ni Nouveau ni Compagnon:\n" + result.missingRole.join("\n");
      }
      message.channel.send(messageToSend);
    });
  },
  
  time: function(message) {
    var member = message.member;
    var joinDate = new Date(member.joinedTimestamp);
    var currentDate = Date.now();
    var diffNum = currentDate - joinDate;
    var diff = new Date(diffNum);
    
    logger.info(diff);
    diff.setTime( diff.getTime() + diff.getTimezoneOffset() * 60 * 1000 ); 
    
    var result = "<@" + member.id + ">, vous etes sur le serveur depuis le : " + joinDate.getDate() + "/" + (joinDate.getMonth() + 1) + "/" + joinDate.getFullYear() + ". Cela fait " + (diff.getFullYear() - 1970) + " an(s), " + diff.getMonth() + " mois, " + (diff.getDate()-1) + " jour(s), " + diff.getHours() + " heure(s) et " + diff.getMinutes() + " minutes"; 
    
    message.channel.send(result);
  }
}