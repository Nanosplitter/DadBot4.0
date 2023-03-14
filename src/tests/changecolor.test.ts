import { ChangeColor } from "../commands/changecolor";
import type { CommandInteraction } from "discord.js";

describe("changecolor", () => {
  it("should return changed color", async () => {
    const interaction = {
      reply: jest.fn(),
      options: {
        getString: jest.fn(),
      },
    };

    await ChangeColor.prototype.execute.call({ client: {} }, interaction as unknown as jest.Mocked<CommandInteraction>);

    expect(interaction.reply).toHaveBeenCalled();
  });
});
