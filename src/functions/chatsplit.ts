export function chatsplit(text: string): string[] {
  const chunks: string[] = [];
  const split = text.split(`\`\`\``);

  for (let i = 0; i < split.length; i++) {
    if (split[i] === "") {
      continue;
    }
    if (i % 2 === 0) {
      processNonCodeBlock(split[i], chunks);
    } else {
      processCodeBlock(split[i], chunks);
    }
  }

  return chunks;
}

function processNonCodeBlock(text: string, chunks: string[]) {
  while (text.length > 2000) {
    let index = text.substring(0, 2000).lastIndexOf("\n");
    if (index === -1) {
      index = 2000;
    }
    chunks.push(text.substring(0, index));
    text = text.substring(index);
  }
  chunks.push(text);
}

function processCodeBlock(text: string, chunks: string[]) {
  const language = text.substring(0, text.indexOf("\n"));
  text = text.substring(text.indexOf("\n") + 1);

  while (text.length > 1994) {
    let index = text.substring(0, 1994).lastIndexOf("\n");
    if (index === -1) {
      index = 1994;
    }

    chunks.push(`\`\`\`${language}\n${text.substring(0, index)}\`\`\``);
    text = text.substring(index);
  }
  chunks.push(`\`\`\`${language}${text}\`\`\``);
}
