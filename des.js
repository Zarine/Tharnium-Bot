var utils = require('./utils');

module.exports = {
  lanceDes: function(args) {
    const argument = args.shift().toLowerCase().split('d');
    var result = 0;
    var details = [];
    for(i = 0; i < argument[0]; i++)
    {
      var valeur = Math.floor((Math.random() * argument[1]) + 1);
      result += valeur;
      details.push(valeur);
    }
  var text = "Résultat : " + result + "\n Les dés ont fait : " + details.join(", ");
    return text;
  }
}
