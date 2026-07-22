import { writeFileSync } from "fs";
import { buildKeyMaps } from "../src/decode-qr-pago-movil/deobfuscate";
import keysData from "../src/decode-qr-pago-movil/keys";

const keys = buildKeyMaps(keysData.strings as any);

const code = `// Auto-generated - Do not edit
export const aesKeys = ${JSON.stringify(keys.aesKeys, null, 2)};

export const rsaKeys = ${JSON.stringify(keys.rsaKeys, null, 2)};
`;

writeFileSync("src/decode-qr-pago-movil/keys-processed.ts", code);
console.log(
  "Preprocessed keys written to src/decode-qr-pago-movil/keys-processed.ts",
);
console.log(`AES merchants: ${Object.keys(keys.aesKeys).length}`);
console.log(`RSA merchants: ${Object.keys(keys.rsaKeys).length}`);
