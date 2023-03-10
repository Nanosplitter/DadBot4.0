import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { Message } from "discord.js";
import config from "../config.json";
import { Configuration, OpenAIApi } from "openai";

type ChatMessage = {
  role: string;
  content: string;
};

export class ChatGpt extends Event {
  constructor(client: ShewenyClient) {
    super(client, "messageCreate", {
      description: "Message was sent",
      once: false,
      emitter: client,
    });
  }

  async execute(message: Message) {
    if (!message.channel.isThread()) {
      return;
    }

    if (message.author.bot) {
      return;
    }

    await message.channel.sendTyping();

    const configuration = new Configuration({
      apiKey: config.OPENAPI_TOKEN,
    });

    const openai = new OpenAIApi(configuration);

    const messages: ChatMessage[] = [];

    const threadMessages = await message.channel.messages.fetch();

    threadMessages.reverse().forEach((threadMessage) => {
      if (threadMessage.content === "") {
        return;
      }
      if (threadMessage.author.bot) {
        messages.push({
          role: "assistant",
          content: threadMessage.content,
        });
      } else {
        messages.push({
          role: "user",
          content: threadMessage.content,
        });
      }
    });

    while (messages.length > 10) {
      messages.shift();
    }

    messages.unshift({
      role: "system",
      content: "You are DadBot, a chatbot to act like a father and to have fun with the people you chat with.",
    });

    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      // @ts-ignore
      messages: messages,
    });

    const dadMessage = completion!.data!.choices[0]!.message!.content;

    const chunks = chunkSubstr(dadMessage, 2000);

    if (chunks === null) {
      return;
    }

    chunks.forEach(async (chunk) => {
      // @ts-ignore
      await message.channel.send({ content: chunk });
    });
  }
}

function chunkSubstr(str: string, size: number) {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substr(o, size);
  }

  return chunks;
}
