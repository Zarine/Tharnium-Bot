module.exports = {
  getRole: function(guild, roleName)
  {
    var roleToFind;
    guild.roles.cache.forEach(function(role) {
      if(role.name === roleName) { roleToFind = role; }
    });
    return roleToFind;
  }
}
