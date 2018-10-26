module.exports = {
  addWithSeparator: function(result, value, separator) {
    if(result !== "") { result = result + separator; }
    result = result + value;
    return result;
  },
  
  getRole: function(guild, roleName)
  {
    var roleToFind;
    guild.roles.forEach(function(role) {
      if(role.name === roleName) { roleToFind = role; }
    });
    return roleToFind;
  }
}