const listeners = (game)=>([
  {
    route: "user.command",
    authenticated: true,
    handler: ({user, command, payload})=>{
      game.parseText(user, command);
    }
  },
  {
    route: "user.say",
    authenticated: true,
    handler: ({user, command, payload})=>{
      game.say(user, command);
    }
  },
  {
    route: "user.checkname",
    authenticated: false,
    handler: async({username})=>{
      const isFree = await game.userService.usernameIsFree(username);
      return {success: true, isFree};
    }
  },
  {
    route: "user.login",
    authenticated: false,
    handler:({username, password})=>{
      game.userService.doLogin({username, password});
    }
  },
  {
    route: "user.logout",
    authenticated: true,
    handler:({username})=>{
      game.userService.doLogout({username});
    }
  },
  {
    route: "user.inventory.fetch",
    authenticated: true,
    handler:()=>{}
  },
  {
    route: "user.inventory.update",
    authenticated: true,
    handler:()=>{}
  },
  {
    route: "user.stats.fetch",
    authenticated: true,
    handler:()=>{}
  },
]);

module.exports = listeners;