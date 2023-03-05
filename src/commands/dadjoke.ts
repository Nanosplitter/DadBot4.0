import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { ApplicationCommandOptionType, CommandInteraction } from "discord.js";

export default class  extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
        name: "dadjoke",
        description: "Get a timeless one from dad",
        type: "SLASH_COMMAND",
        category: "fun",
        cooldown: 3,
        options: [
          {
            name: "term",
            type: ApplicationCommandOptionType.String,
            description: "A term to get a dad joke about",
            required: false,
          }
        ],
      }
    );
  }

  async execute(interaction: CommandInteraction) {
    var term = interaction.options.get("term")?.value;
    if (term == undefined) {
      term = "";
    }
    var url = `https://icanhazdadjoke.com/search?term=${term}`;
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
    });

    const json = await res.json();
    if (!json.results.length) {
      return interaction.reply({
        content: "No dad jokes found",
        ephemeral: true,
      });
    }
    const joke = json.results[Math.floor(Math.random() * json.results.length)];
    interaction.reply(joke.joke);
  }
};
