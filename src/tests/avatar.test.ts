import { Avatar } from "../commands/avatar";
import type { APIContextMenuInteraction } from "discord.js";

describe("avatar", () => {
  it("should return avatar of user", async () => {
    const interaction = {
      reply: jest.fn(),
      options: {
        getUser: jest.fn(),
      },
    };

    await Avatar.prototype.execute.call({ client: {} }, interaction as unknown as jest.Mocked<APIContextMenuInteraction>);

    expect(interaction.reply).toHaveBeenCalledWith({ content: interaction.options.getUser("user")?.displayAvatarURL({ extension: "png", size: 1024 }) });
  });
});
