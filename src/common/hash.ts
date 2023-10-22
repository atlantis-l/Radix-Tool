import blake from "blakejs";
import { Buffer } from "buffer";
import { bufferToUnit8Array } from "./blake2b";

function hash(input: string): Buffer {
  return Buffer.from(
    blake
      .blake2bHex(bufferToUnit8Array(Buffer.from(input, "hex")), undefined, 32)
      .toString(),
    "hex",
  );
}

export { hash };
