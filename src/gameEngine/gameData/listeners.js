const listeners = (game)=>([
  {
    route: "user.checkName",
    authenticated: false,
    handler: async({body})=>{
      const {username} = body;
      const isFree = await game.userService.usernameIsFree(username);
      return {success: true, isFree};
    }
  },
  {
    route: "user.signup",
    authenticated: false,
    handler: async ({body})=>{
      const {username, password} = body;
      const user = await game.userService.doSignup({username, password});
      return { user };
    }
  },
  {
    route: "user.login",
    authenticated: false,
    handler: async ({body})=>{
      const {username, password} = body;
      const user = await game.userService.doLogin({username, password});
      return { user };
    }
  },
  {
    route: "user.logout",
    authenticated: true,
    handler:({body})=>{
      const {username} = body;
      game.userService.doLogout({username});
    }
  },
  {
    route: "user.command",
    authenticated: true,
    handler: ({body})=>{
      const {user, command} = body;
      game.parseText(user, command);
    }
  },
  {
    route: "user.say",
    authenticated: true,
    handler: ({body})=>{
      const {user, command} = body;
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