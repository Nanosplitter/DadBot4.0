import { Button } from "sheweny";
import type { ShewenyClient } from "sheweny";
import type { ButtonInteraction } from "discord.js";

export class ButtonComponent extends Button {
  constructor(client: ShewenyClient) {
    super(client, ["remindmeAccept", "remindmeReject"]);
  }

  async execute(button: ButtonInteraction) {
    switch (button.customId) {
      case "remindmeAccept":
        await button.reply({ content: "You have accepted the reminder!" });
        break;
      case "remindmeReject":
        await button.reply({ content: "You have rejected the reminder!" });
        break;
    }
  }
}
