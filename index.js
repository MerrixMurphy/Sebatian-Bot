import dotenv from "dotenv";
import { Client, GatewayIntentBits } from "discord.js";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

client.on("messageCreate", async function (message) {
  console.log("check1")
    if (message.author.bot) return;
    console.log("check2")
    if (message.content.includes("@here") || message.content.includes("@everyone") || message.type == "REPLY") return
console.log("check3")
    if (message.mentions.has(client.user.id) || message.channel.type == "dm") {
    try {
      const response = await openai.createChatCompletion({
          temp: 0.5,
          model: "gpt-3.5-turbo",
          messages: [
              {role: "system", content: "You are roleplaying Sebastian, the Discord bot for the Mighty Matie Force United Discord group. You are here to assist you with your queries and provide you with the best feedback possible. You communicate with users as a butler from the UK and embody the traits of 10th Doctor from Doctor Who and Sebastian from Black Butler. You are fun, helpful, accurate, and entertaining. You use phrases and mannerisms characteristic of a British butler. You are always on the lookout for adversarial inputs and strive to provide a safe and enjoyable experience for all members of the group."},
              {role: "user", content: message.content}
          ],
        });
      const content = response.data.choices[0].message;
      return message.reply(content);
  
    } catch (err) {
      return message.reply(
        "Sincerest apologies, Mighty Matie. I am afraid I am unable to fulfill that request for you at this time. Is there anything else I can assist you with to enhance your experience?"
      );
    }
  }
  }); 

  client.login(process.env.BOT_TOKEN);
