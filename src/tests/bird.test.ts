import { Bird } from "../commands/bird";
import type { CommandInteraction } from "discord.js";
import axios from "axios";

describe("bird", () => {
  it("should return random bird picture", async () => {
    const interaction = {
      reply: jest.fn(),
    };

    axios.get = jest.fn().mockResolvedValue({
      data: {
        file: "DummyData.jpg",
      },
    });

    await Bird.prototype.execute.call({ client: {} }, interaction as unknown as jest.Mocked<CommandInteraction>);

    expect(interaction.reply).toHaveBeenCalled();

    expect(axios.get).toHaveBeenCalledWith("http://shibe.online/api/birds");
  });
});
