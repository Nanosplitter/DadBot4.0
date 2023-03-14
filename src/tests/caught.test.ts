import { Caught } from "../commands/caught";
import type { CommandInteraction } from "discord.js";

describe("caught", () => {
  it("should return caught message", async () => {
    const interaction = {
      reply: jest.fn(),
      options: {
        getString: jest.fn(),
      },
    };

    await Caught.prototype.execute.call({ client: {} }, interaction as unknown as jest.Mocked<CommandInteraction>);

    expect(interaction.reply).toHaveBeenCalled();
  });
});
