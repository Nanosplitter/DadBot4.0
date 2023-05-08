import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { APIEmbed, ApplicationCommandOptionType, CommandInteraction, Message } from "discord.js";

export class Poll extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "poll",
      description: "Create a poll with specified options",
      type: "SLASH_COMMAND",
      category: "Misc",
      cooldown: 0,
      options: [
        {
          name: "question",
          description: "The main question for the poll",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
        {
          name: "option1",
          description: "The first option for the poll",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "option2",
          description: "The second option for the poll",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "option3",
          description: "The third option for the poll",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "option4",
          description: "The fourth option for the poll",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
        {
          name: "option5",
          description: "The fifth option for the poll",
          type: ApplicationCommandOptionType.String,
          required: false,
        },
      ],
    });
  }

  async execute(interaction: CommandInteraction) {
    const optionValues = [
      interaction.options.get("option1")?.value,
      interaction.options.get("option2")?.value,
      interaction.options.get("option3")?.value,
      interaction.options.get("option4")?.value,
      interaction.options.get("option5")?.value,
    ];

    const hasUserOptions = optionValues.some((value) => value !== null && value !== undefined);
    const options = hasUserOptions ? optionValues.filter((value) => value !== null && value !== undefined).slice(0, 5) : ["Yes", "No", "Maybe"];

    const emojis = hasUserOptions ? ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣"] : ["✅", "❌", "🤷‍♂️"];

    const pollText = `${options.map((option: any, index: number) => `${emojis[index]} - ${option.toString()}`).join("\n")}`;

    const pollEmbed: APIEmbed = {
      title: interaction.options.get("question")?.value?.toString(),
      description: pollText,
      color: 0x00ff00,
    };

    const pollMessage = (await (await interaction.reply({ embeds: [pollEmbed] })).fetch()) as Message;

    for (let i = 0; i < options.length && i < emojis.length; i++) {
      await pollMessage?.react(emojis[i]);
    }
  }
}
