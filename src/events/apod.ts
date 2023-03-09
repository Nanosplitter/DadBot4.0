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
    const channelId = "856919399789625376";
    const channel = (await this.client.channels.fetch(channelId)) as TextChannel;

    const apodUrl = "https://api.nasa.gov/planetary/apod?api_key=hQqgupM0Ghb1OTjjrPkoIDw1EJq6pZQQdgMGBpnb";

    const apod = await fetch(apodUrl).then((res) => res.json());

    const embed = new EmbedBuilder().setTitle(apod.title).setDescription(apod.explanation);

    embed.setImage(apod.url);

    channel.send({ embeds: [embed] });
  }
}
