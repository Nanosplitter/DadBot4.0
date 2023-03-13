import { Bird } from "../commands/bird";
import type { CommandInteraction } from "discord.js";

describe("bird", () => {
  it("should return random bird picture", async () => {
    const interaction = {
      reply: jest.fn(),
    };

    await Bird.prototype.execute.call({ client: {} }, interaction as unknown as jest.Mocked<CommandInteraction>);

    expect(interaction.reply).toHaveBeenCalled();
  });
});
