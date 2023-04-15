import config from "../config.json";
import { Configuration, OpenAIApi } from "openai";
import { Message } from "discord.js";
import { chatsplit } from "../functions/chatsplit";
import { ChatGPT } from "../models/chatgpt";
import { ChatMessage } from "../models/chatgpt";

export async function chatgpt(message: Message) {
  if (!message.channel.isThread()) {
    return;
  }

  if (message.author.bot) {
    return;
  }

  try {
    await message.channel.sendTyping();

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

    const chunks = await new ChatGPT("gpt-3.5-turbo").chatgpt(messages);

    if (chunks === null) {
      return;
    }

    chunks.forEach(async (chunk) => {
      // @ts-ignore
      await message.channel.send({ content: chunk });
    });
  } catch (error) {
    console.log(error);
    await message.channel.send({ content: "Something went wrong! Try sending another message or making a new chat" });
  }
}
