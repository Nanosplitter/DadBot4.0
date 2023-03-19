export function chatsplit(text: string): string[] {
  const chunks: string[] = [];

  const split = text.split("```");

  for (let i = 0; i < split.length; i++) {
    if (split[i] === "") {
      continue;
    }
    if (i % 2 === 0) {
      while (split[i].length > 2000) {
        let index = split[i].substring(0, 2000).lastIndexOf("\n");
        if (index === -1) {
          index = 2000;
        }
        chunks.push(split[i].substring(0, index));
        split[i] = split[i].substring(index);
      }
      chunks.push(split[i]);
    } else {
      const language = split[i].substring(0, split[i].indexOf(" "));
      split[i] = split[i].substring(split[i].indexOf("\n") + 1);
      while (split[i].length > 1994) {
        let index = split[i].substring(0, 1994).lastIndexOf("\n");
        if (index === -1) {
          index = 1994;
        }

        chunks.push(`\`\`\`${language}\n${split[i].substring(0, index)}\`\`\``);
        split[i] = split[i].substring(index);
      }
      chunks.push(`\`\`\`${language}${split[i]}\`\`\``);
    }
  }

  return chunks;
}
