import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { CommandInteraction } from "discord.js";
import { chatsplit } from "../functions/chatsplit";
import path from "path";
import fs from "fs";

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "echo",
      description: "make dad say something",
      type: "SLASH_COMMAND",
      category: "Other",
    });
  }

  async execute(interaction: CommandInteraction) {
    const text = fs.readFileSync(path.join(__dirname, "../tests/resources/long-code.txt"), "utf-8");
    console.log(text.length);
    await interaction.deferReply();
    await interaction.followUp({ content: "Splitting message..." });
    for (const chunk of chatsplit(text)) {
      console.log(chunk.length);
      //@ts-ignore
      await interaction.channel!.send({ content: chunk });
    }
  }
}
