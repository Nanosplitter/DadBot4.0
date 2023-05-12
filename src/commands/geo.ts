import { Command } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { CommandInteraction, Embed, EmbedBuilder, AttachmentBuilder } from "discord.js";
import { Client } from "@googlemaps/google-maps-services-js";
import config from "../config.json";

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
    //const embed = new EmbedBuilder().setTitle("Welcome to Geo Guesser!").setDescription("You will have one minute to guess the location of the picture. Click the button to make a guess!");
    //await interaction.reply({ embeds: [embed] });

    // get random city from geodata.json
    const cities = require("../../resources/geodata.json");
    const place = cities[Math.floor(Math.random() * cities.length)];

    console.log(place);

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
    let location = { lat: 0, lng: 0 };
    await client
      .geocode(args)
      .then((gcResponse) => {
        location = gcResponse.data.results[0].geometry.location;
        console.log(location);
      })
      .catch((e) => {
        console.log(e);
      });

    console.log(location);

    // Make a request for a street view image
    // with template https://maps.googleapis.com/maps/api/streetview?size=400x400&location={location}&fov=80&heading=0&pitch=0&key=YOUR_API_KEY
    // use a raw get request for this. Do not use the client.

    const response = await fetch(`https://maps.googleapis.com/maps/api/streetview?size=400x400&location=${location.lat},${location.lng}&fov=80&heading=0&pitch=0&key=${config.G_MAPS_API_KEY}`);

    const buffer = Buffer.from(await response.arrayBuffer());

    const file = new AttachmentBuilder(buffer, { name: "img.jpg" });

    const embed = new EmbedBuilder().setTitle("Street View Image").setImage("attachment://img.jpg");

    await interaction.reply({ embeds: [embed], files: [file] });
  }
}
