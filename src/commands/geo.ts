import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, EmbedBuilder, AttachmentBuilder, InteractionReplyOptions, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import { Client } from "@googlemaps/google-maps-services-js";
import config from "../config.json";

type Location = {
  interactionOptions: InteractionReplyOptions;
  address: string;
  lat: number;
  lng: number;
};

export default class extends Command {
  constructor(client: ShewenyClient) {
    super(client, {
      name: "geo",
      description: "Default description",
      type: "SLASH_COMMAND",
      category: "Other",
    });
  }

  async execute(interaction: CommandInteraction) {
    await interaction.deferReply();

    const location = await this.getLocation();

    await interaction.followUp(location.interactionOptions);

    console.log(location);
  }

  async getLocation(): Promise<Location> {
    let foundValidLocation = false;

    let response = null;
    let address = "No Address Found";
    let location = { lat: 0, lng: 0 };

    while (!foundValidLocation) {
      const cities = require("../../resources/geodata.json");
      const place = cities[Math.floor(Math.random() * cities.length)];

      const city = place.name;
      const subCountry = place.subcountry;
      const country = place.country;

      const args = {
        params: {
          key: config.G_MAPS_API_KEY,
          address: `${city}, ${subCountry}, ${country}`,
        },
      };

      const client = new Client();
      location = { lat: 0, lng: 0 };
      await client
        .geocode(args)
        .then((gcResponse) => {
          location = gcResponse.data.results[0].geometry.location;
          address = gcResponse.data.results[0].formatted_address;
        })
        .catch((e) => {
          console.log(e);
        });

      response = await fetch(
        `https://maps.googleapis.com/maps/api/streetview?size=2000x2000&location=${location.lat},${location.lng}&fov=80&heading=0&pitch=0&key=${config.G_MAPS_API_KEY}&return_error_code=true`
      );

      foundValidLocation = response.ok;
    }

    const buffer = Buffer.from(await response!.arrayBuffer());

    const file = new AttachmentBuilder(buffer, { name: "img.jpg" });

    const embedImage = new EmbedBuilder().setTitle(address).setImage("attachment://img.jpg");

    const embedResults = new EmbedBuilder().setTitle("Guesses will go here!");

    const row = new ActionRowBuilder().addComponents([new ButtonBuilder().setCustomId("geoguess").setLabel("Guess").setStyle(ButtonStyle.Primary)]);

    return {
      // @ts-ignore
      interactionOptions: { embeds: [embedImage, embedResults], files: [file], components: [row] },
      address: address,
      lat: location.lat,
      lng: location.lng,
    };
  }
}
