require('dotenv').config(); // accesses .env variables
const https = require('https');
const tmi = require('tmi.js');

// Accepts a !command <option>
const regexpCommand = new RegExp(/^!([a-zA-Z0-9]+)(?:\W+)?(.*)?/);

const commands = {
  discord: {
    response: 'discord link'
  },
}

const client = new tmi.Client({
  options: { debug: true, messagesLogLevel: "info" },
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: process.env.TWITCH_USERNAME_BOT,
    password: process.env.TWITCH_BOT_OAUTH,
  },
	channels: [ process.env.TWITCH_CHANNEL_ID ]
});

client.connect().catch(console.error);

client.on('message', (channel, tags, message, self) => {
  const isNotBot = tags.username.toLowerCase() !== process.env.TWITCH_USERNAME_BOT;

  if (!isNotBot) return;

  // Discord Invite Link
  if (message.toLowerCase() === '!discord') {
    client.say(channel, `Join our Discord! https://discord.gg/BktMztHNuW`);
  }

  /**
 * Random commands
 */

  // DAD JOKES - api calls
  if (message.toLowerCase() === "!dadjoke") {
    // api call options
    const options = {
      hostname: "icanhazdadjoke.com",
      headers: { Accept: "text/plain" },
      path: "/",
      method: "GET",
      rejectUnauthorized: false,
    };
    // request
    const req = https.request(options, (res) => {
      res.on("data", (d) => {
        // posting the plain text response into the chat
        client.say(channel, `${d}`);
        // process.stdout.write(d); // This is pretty much just console.logging the results
      });
    });

    req.end();
  }
  // Flip desk
  if (message.toLowerCase() === "!flipdesk") {
    const randomNumber = Math.floor(Math.random() * 3);
    if (randomNumber === 0) {
      client.say(channel, `(╯°□°）╯︵ ┻━┻`);
    } else if (randomNumber === 1) {
      client.say(channel, `┻━┻ ︵ ヽ(°□°ヽ)`);
    } else {
      client.say(channel, `┬─┬ノ( º _ ºノ) Please don't make me flip this desk.`);
    }
  }
});