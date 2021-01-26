const listeners = (game)=>([
  {
    subject: "user.checkName",
    authenticated: false,
    handler: async({body})=>{
      const {username} = body;
      const isFree = await game.userService.usernameIsFree(username);
      return {success: true, isFree};
    }
  },
  {
    subject: "user.signup",
    authenticated: false,
    handler: async ({body})=>{
      const {username, password} = body;
      const user = await game.userService.doSignup({username, password});
      return { user };
    }
  },
  {
    subject: "user.login",
    authenticated: false,
    handler: async ({body})=>{
      const {username, password} = body;
      const user = await game.userService.doLogin({username, password});
      return { user };
    }
  },
  {
    subject: "user.logout",
    authenticated: true,
    handler:({body})=>{
      const {username} = body;
      game.userService.doLogout({username});
    }
  },
  {
    subject: "user.command",
    authenticated: true,
    handler: ({body})=>{
      const {user, command} = body;
      console.log("in handler", user, command);
      game.parseText(user, command);
    }
  },
  {
    subject: "user.say",
    authenticated: true,
    handler: ({body})=>{
      const {user, command} = body;
      game.say(user, command);
    }
  },
  {
    subject: "user.inventory.fetch",
    authenticated: true,
    handler:()=>{}
  },
  {
    subject: "user.inventory.update",
    authenticated: true,
    handler:()=>{}
  },
  {
    subject: "user.stats.fetch",
    authenticated: true,
    handler:()=>{}
  },
]);

module.exports = listeners;