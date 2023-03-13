import { Cat } from "../commands/cat";
import axios from "axios";
import type { CommandInteraction } from "discord.js";

describe("cat", () => {
  it("should return random cat picture", async () => {
    const interaction = {
      reply: jest.fn(),
    };

    axios.get = jest.fn().mockResolvedValue({
      data: {
        file: "DummyData.jpg",
      },
    });

    await Cat.prototype.execute.call({ client: {} }, interaction as unknown as jest.Mocked<CommandInteraction>);

    expect(interaction.reply).toHaveBeenCalled();

    expect(axios.get).toHaveBeenCalledWith("https://aws.random.cat/meow");
  });
});
