import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
// @ts-ignore
import type { ContextMenuInteraction } from "discord.js";

export class Avatar extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "avatar",
      description: "Get avatar of user",
      type: "CONTEXT_MENU_USER",
      category: "fun",
    });
  }

  async execute(interaction: ContextMenuInteraction) {
    return interaction.reply({
      content: interaction.options.getUser("user")?.displayAvatarURL({ extension: "png", size: 1024 }),
    });
  }
}
