import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";
import { ChatGPT, ChatMessage } from "../models/chatgpt";
import { addStory, getStories } from "../models/pancakechan-table";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "pancakechan",
      description: "Make a new episode of pancake-chan",
      type: "SLASH_COMMAND",
      category: "pancake-chan",
    });
  }

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();
    // await getStories().then((stories) => {
    //   console.log(stories);
    // });
    const messages: ChatMessage[] = [];

    const systemMessage = "You are the creator of the hit anime 'Pancake Chan'";

    messages.push({
      role: "system",
      content: systemMessage,
    });

    await getStories().then((stories) => {
      stories.forEach((story) => {
        messages.push({
          role: "assistant",
          content: story.story,
        });
      });
    });

    messages.push({
      role: "user",
      content:
        "Make the next episode of Pancake Chan based on the previous episodes. Feel free to throw in a plot twist if it would make the story better. Continue the story of Skyler, Pancake Chan, Blueberry Chan, Strawberry Chan, and the rest of the gang.",
    });

    const response = await new ChatGPT("gpt-3.5-turbo").chatgpt(messages);

    // Join all the chunks together and use pancakechan-table to put it in the database
    const story = response.join("");
    await addStory(story);

    response.forEach(async (chunk) => {
      // @ts-ignore
      await interaction.followUp({ content: chunk });
    });
  }
}
