const { Client, GatewayIntentBits } = require("discord.js");
require("dotenv").config();
const client = new Client({
  intents: [
    "GUILDS",
    "GUILD_MESSAGES",
    "GUILD_PRESENCES",
    "GUILD_MEMBERS",
    "GUILD_VOICE_STATES",
  ],
});

const botToken = process.env.ACCESS_TOKEN;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// client.on("interactionCreate", async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === "ping") {
//     await interaction.reply("Pong!");
//   }
// });

// client.on("message", (message) => {
//   console.log(message.content);
//   if (message.content === "Hi") {
//     message.reply("Hello");
//   }
// });

client.on("voiceStateUpdate", async (oldState, newState) => {
  const VOICE_SUPPORT_ID = "690403751952908392";
  const LOG_CHANNEL_ID = "690403751952908391";
  // if there is no newState channel, the user has just left a channel
  const USER_LEFT = !newState.channel;
  // if there is no oldState channel, the user has just joined a channel
  const USER_JOINED = !oldState.channel;
  // if there are oldState and newState channels, but the IDs are different,
  // user has just switched voice channels
  const USER_SWITCHED = newState.channel?.id !== oldState.channel?.id;

  // if a user has just left a channel, stop executing the code
  if (USER_LEFT) return;

  if (
    // if a user has just joined or switched to a voice channel
    (USER_JOINED || USER_SWITCHED) &&
    // and the new voice channel is the same as the support channel
    newState.channel.id === VOICE_SUPPORT_ID
  ) {
    try {
      let logChannel = await client.channels.fetch(LOG_CHANNEL_ID);

      logChannel.send(`${newState.member.displayName} joined the channel`);
    } catch (err) {
      console.error("❌ Error finding the log channel, check the error below");
      console.error(err);
      return;
    }
  }
});

client.login(botToken);
