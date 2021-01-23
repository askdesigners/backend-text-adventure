const listeners = (game)=>([
  {
    route: "user.checkName",
    authenticated: false,
    handler: async(username)=>{
      console.log(username);
      // const isFree = await game.userService.usernameIsFree(username);
      return {success: true, isFree: false};
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
    route: "user.command",
    authenticated: true,
    handler: ({user, command})=>{
      game.parseText(user, command);
    }
  },
  {
    route: "user.say",
    authenticated: true,
    handler: ({user, command})=>{
      game.say(user, command);
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