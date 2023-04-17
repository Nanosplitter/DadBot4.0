import { TextChannel } from "discord.js";
import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { addStory, getStories } from "../models/pancakechan-table";
import { ChatGPT, ChatMessage } from "../models/chatgpt";
import { schedulerEmitter } from "../emitters/scheduler-emitter";

export default class PancakeChan extends Event {
  constructor(client: ShewenyClient) {
    super(client, "pancakechan", {
      description: "A new Pancake Chan episode",
      once: false,
      emitter: schedulerEmitter,
    });
  }

  async execute() {
    console.log("Pancake Chan episode requested");
    const channelId = "1097527048009949264";
    const channel = (await this.client.channels.fetch(channelId)) as TextChannel;

    const messages: ChatMessage[] = [];

    const systemMessage = "You are the creator of the hit anime 'Pancake Chan'";

    console.log("Starting message creation");

    messages.push({
      role: "system",
      content: systemMessage,
    });

    await getStories().then((stories) => {
      stories.reverse().forEach((story) => {
        messages.push({
          role: "assistant",
          content: story.story,
        });
      });
    });

    messages.push({
      role: "user",
      content:
        "Make the next episode of Pancake Chan based on the previous episodes. Throw in some plot twists and fun. There should be character development and story arcs. Continue the story of Skyler, Pancake Chan, Blueberry Chan, Strawberry Chan, and the rest of the gang. The story should be at least 1000 words long.",
    });

    console.log("Generating story...");

    const response = await new ChatGPT("gpt-3.5-turbo").chatgpt(messages);

    console.log("Generated story. Adding to database...");
    const story = response.join("");

    await addStory(story);

    console.log("Added to database. Sending to channel...");
    await channel.send({
      content: "-----------------------------------------------\n.\n.\n.\n-----------------------------------------------",
    });

    response.forEach(async (chunk) => {
      await channel.send({ content: chunk });
    });
  }
}
