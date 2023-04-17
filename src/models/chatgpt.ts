import config from "../config.json";
import { Configuration, OpenAIApi } from "openai";
import { chatsplit } from "../functions/chatsplit";

export type ChatMessage = {
  role: string;
  content: string;
};

export class ChatGPT {
  model: string = "gpt-3.5-turbo";

  configuration = new Configuration({
    apiKey: config.OPENAPI_TOKEN,
  });

  openai = new OpenAIApi(this.configuration);

  constructor(model: string) {
    this.model = model;
  }

  async chatgpt(messages: ChatMessage[]) {
    const completion = await this.openai.createChatCompletion({
      model: this.model,
      // @ts-ignore
      messages: messages,
    });

    const response = completion!.data!.choices[0]!.message!.content;

    const chunks = chatsplit(response);

    return chunks;
  }

  async dalle2(prompt: string) {
    const response = await this.openai.createImage({
      prompt: prompt,
      n: 1,
      size: "512x512",
    });
    return response.data.data[0].url;
  }
}
