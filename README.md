# remote-countdown
Small multiplattform app to sync a timer between several remote clients.

### Why?
Working in my company, the team does small presentations in an online meeting of the work done along a SCRUM sprint. 
The problem is that these presentations usually spend more time than they should.

### How it looks/works
![app screenshot](https://raw.githubusercontent.com/pabloes/remote-countdown/master/fisrt-no-style-screenshot.png?raw=true)
(sorry for no styling it yet :( ))


First thing is to connect to a host, See next "How to run it section" to connect to localhost or just try `ws://guarded-eyrie-7081.herokuapp.com`

If you are the admin who are going to control the countdown, then create a session. To create a session you can type a session name or leave it empty to generate a random key, then share this session key/name with other remote clients.

Other remote clients should also connect to the host and join the session by pasting the session key in the input near to the "join session" button, nothing more, just wait for the countdown session admin to see the countdown. 

### How to run it
#### - From the source project
Clone the git repository and run `npm install` in the root folder.
Then run `npm run start-dev`
- This command runs the server (with `forever npm run server`) and webpack-dev-server.

Now, with the browser (only tested Chrome for now) access `http://localhost:8080/webpack-dev-server/`

### How to generate desktop app
Run `npm run nwjs`
OS app files will be placed in `<root-folder>/webkitbuilds`

### Last thing: help needed
This is a really small app, I don't have too much time to work on it. Any help is welcome, a lot of work can be done:
- UI: For Now I just used html styles.
- Mutilple clocks per session.
- Code refactors
- CI
- ...

If you think you can help on something don't hesitate to do PR or concat me.

