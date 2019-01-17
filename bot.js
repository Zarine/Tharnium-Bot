var Discord = require('discord.js');
var logger = require('winston');
var fs = require('fs');

var commands = require('./bot/commands');
var config = require('./conf/conf.json');
var des = require('./des');
var update = require('./update');
var utils = require('./utils');
var divers = require('./divers');
var note = require('./note');
var jdr = require('./jdr');
var commandHelp = require('./commandHelp');
var guessGame = require('./guessGame');

process.setMaxListeners(500);

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
  colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client();

bot.on('ready', function (evt) {
  logger.info('Connected');
  logger.info('Logged in as: ');
  logger.info(bot.user.username + "-" + bot.user.id);
  
  var state = {};
  state.status = "online";
  state.activity = {};
  state.activity.name = "aide: ?command";
  state.activity.type = "playing";
  bot.setStatus(state);
});

bot.on("guildMemberAdd", member =>   
{
  logger.info("Nouveau user : " + member.user.username);
  
  const guild = member.guild;
  guild.channels.get(config.welcomeChannelId).send("Bienvenue au nouveau membre de la communauté : " + member.user);
  
  var roleToAdd = utils.getRole(guild, 'Nouveau');
  logger.info("Adding role : " + roleToAdd + " which is " + roleToAdd.name + " to member : " + member.user.username);
  member.addRole(roleToAdd).catch(console.error);
});

bot.on('message', (message) =>
{
  commands.handleCommand(message);
});

bot.login(process.env.auth);