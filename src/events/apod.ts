import axios from "axios";
import { Event } from "sheweny";
import type { ShewenyClient } from "sheweny";
import { schedulerEmitter } from "../emitters/scheduler-emitter";
import { EmbedBuilder, TextChannel } from "discord.js";

export default class extends Event {
  constructor(client: ShewenyClient) {
    super(client, "runapod", {
      description: "Event that runs every day to get the Astronomy Picture of the Day",
      emitter: schedulerEmitter,
      once: false,
    });
  }

  async execute() {
    // const channelId = "856919399789625376";
    // const channel = (await this.client.channels.fetch(channelId)) as TextChannel;

    // const channelId2 = "1105336042296463432";
    // const channel2 = (await this.client.channels.fetch(channelId2)) as TextChannel;

    // const request = await axios.get("https://api.nasa.gov/planetary/apod?api_key=hQqgupM0Ghb1OTjjrPkoIDw1EJq6pZQQdgMGBpnb");
    // const apod = request.data;

    // const embed = new EmbedBuilder().setTitle(apod.title).setDescription(apod.explanation);

    // embed.setImage(apod.url);

    // channel.send({ embeds: [embed] });
    // channel2.send({ embeds: [embed] });
  }
}
