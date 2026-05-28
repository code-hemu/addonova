import { mkdirSync, readdirSync, existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

const localesDir = join(__dirname, "_locales");
const outputDir = join(__dirname, "output", "_locales");

mkdirSync(outputDir, { recursive: true });

console.log("Output directory ready.");

const languages = readdirSync(localesDir);

languages.forEach((lang) => {
  const messagesPath = join(localesDir, lang, "messages.json");

  if (!existsSync(messagesPath)) return;

  const input = JSON.parse(readFileSync(messagesPath, "utf8"));

  let output = "";

  for (const key in input) {
    output += `@${key}\n`;
    output += `${input[key].message}\n\n`;
  }

  const outputPath = join(outputDir, `${lang}.i18n`);
  writeFileSync(outputPath, output);

  console.log(`${lang}.i18n created`);
});

console.log("All conversions completed.");
