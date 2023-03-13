import { Ping } from "../commands/ping";
import type { CommandInteraction } from "discord.js";

describe("ping", () => {
  it("should return pong", async () => {
    const interaction = {
      reply: jest.fn(),
    };

    await Ping.prototype.execute.call({ client: {} }, interaction as unknown as jest.Mocked<CommandInteraction>);

    expect(interaction.reply).toHaveBeenCalledWith({ content: "Pong" });
  });
});
