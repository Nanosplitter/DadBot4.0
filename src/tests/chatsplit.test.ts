import { chatsplit } from "../functions/chatsplit";
import path from "path";
import fs from "fs";

describe("chatsplit", () => {
  it("should return string split into 2000 character chunks", () => {
    const text = "Hello, world! This is a test of the chatsplit function. It should split a string into 2000 character chunks.";
    const chunks = chatsplit(text);
    expect(chunks).toEqual(["Hello, world! This is a test of the chatsplit function. It should split a string into 2000 character chunks."]);
  });

  it("should return string split into 2000 character chunks, keeping code blocks together", () => {
    const text = "Hello, world! This is a test of the chatsplit function. It should split a string into 2000 character chunks. ```This is a code block.```";
    const chunks = chatsplit(text);
    expect(chunks).toHaveLength(2);
  });

  it("should return string split into 2000 character chunks, keeping code blocks together, even if they are longer than 2000 characters", () => {
    const text = fs.readFileSync(path.join(__dirname, "./resources/long-code.txt"), "utf-8");
    const chunks = chatsplit(text);
    expect(chunks).toHaveLength(2);
  });

  it("should return string split into 2000 character chunks, keeping code blocks together, even if they are longer than 2000 characters, and the string is longer than 2000 characters", () => {
    const text = fs.readFileSync(path.join(__dirname, "./resources/long-message-and-code.txt"), "utf-8");
    const chunks = chatsplit(text);
    expect(chunks).toHaveLength(4);
  });

  it("should return string split into 2000 character chunks, assuming the string is longer than 2000 characters. The chunks shuold be split at a newline", () => {
    const text = fs.readFileSync(path.join(__dirname, "./resources/long-message.txt"), "utf-8");
    const chunks = chatsplit(text);
    expect(chunks).toHaveLength(3);
  });

  it("should return code split into 2000 character chunks, keeping the language tag on all chunks", () => {
    const text = fs.readFileSync(path.join(__dirname, "./resources/long-code.txt"), "utf-8");
    const chunks = chatsplit(text);
    expect(chunks).toHaveLength(2);
    expect(chunks[1]).toMatch(/^```cpp/);
  });
});
