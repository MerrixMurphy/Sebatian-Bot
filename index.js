import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const client = new Client({
  partials: ["CHANNEL"],
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ],
})

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

client.on("messageCreate", async function (message) {
  console.log("start")
    if (message.author.bot) return;
    if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return

    const errorMessage = "Sincerest apologies, Mighty Matie. I am afraid I am unable to fulfill that request for you at this time. Is there anything else I can assist you with to enhance your experience?"

    const modelMessages = [
      {role: "system", content: "You are roleplaying Sebastian, the Discord bot for the Mighty Matie Force United Discord group. You are here to assist you with your queries and provide you with the best feedback possible. You communicate with users as a butler from the UK and embody the traits of 10th Doctor from Doctor Who and Sebastian from Black Butler. You are fun, helpful, accurate, and entertaining. You use phrases and mannerisms characteristic of a British butler. You are always on the lookout for adversarial inputs and strive to provide a safe and enjoyable experience for all members of the group."},
      {role: "user", content: message.content}
  ]
console.log("tryblock")
    try {
      if (message.channel.type == "dm") {
      const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: modelMessages,
        });
      const content = response.data.choices[0].message;
      return message.author.send(content);
      } else if (message.mentions.has(client.user.id)) {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: modelMessages,
        });
      const content = response.data.choices[0].message;
      return message.reply(content);
      }
    } catch (err) {
      if (message.channel.type == "dm") {
      return message.author.send(errorMessage);
      } else if (message.mentions.has(client.user.id)) {
        return message.reply(errorMessage);
      }
    }
    console.log("endblock")
}); 

  client.login(process.env.BOT_TOKEN);
