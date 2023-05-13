import { Interaction } from "discord.js";
import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { Client } from "@googlemaps/google-maps-services-js";
import config from "../config.json";

export default class extends Event {
  constructor(client: ShewenyClient) {
    super(client, "interactionCreate", {
      description: "Default description",
      once: false,
    });
  }

  async execute(interaction: Interaction) {
    if (!interaction.isModalSubmit() || interaction.customId !== "geoguess") {
      return;
    }

    const locationGuess = interaction.fields.getTextInputValue("location");

    console.log(await this.getLocation(locationGuess));

    if (interaction.guildId === null) {
      return;
    }

    interaction.deferUpdate();
  }

  async getLocation(guess: string) {
    const args = {
      params: {
        key: config.G_MAPS_API_KEY,
        address: guess,
      },
    };

    const client = new Client();
    return await client
      .geocode(args)
      .then((gcResponse) => {
        return gcResponse.data.results[0];
      })
      .catch((e) => {
        console.log(e);
      });
  }
}
