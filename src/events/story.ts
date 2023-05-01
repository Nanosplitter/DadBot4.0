import { TextChannel } from "discord.js";
import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { addStory, getStories } from "../models/stories-table";
import { ChatGPT, ChatMessage } from "../models/chatgpt";
import { schedulerEmitter } from "../emitters/scheduler-emitter";

export default class Story extends Event {
  constructor(client: ShewenyClient) {
    super(client, "newstory", {
      description: "A new episode in the story",
      once: false,
      emitter: schedulerEmitter,
    });
  }

  async execute() {
    console.log("Story episode requested");
    const channelId = "1097367008997294171";
    const channel = (await this.client.channels.fetch(channelId)) as TextChannel;

    const messages: ChatMessage[] = [];

    const systemMessage = "You are the creator of the hit story 'The Free Market'. You are tasked with creating the next episode of the story.";

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
        "Make the next episode of 'The Free Market' based on the previous episodes. Throw in some plot twists and fun. The next episode should be more adventurous than the last. There should be character development and story arcs. Continue the story of Liam, Colin, Keller, Vandermolen, Skyler, Simon, Lily, Alex, and Fatimah. The story should be at least 1000 words long.",
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
