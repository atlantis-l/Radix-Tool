import blake from "blakejs";
import { Buffer } from "buffer";

const toArrayBuffer = (buffer: Buffer): ArrayBuffer => {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
};

const bufferToUnit8Array = (buffer: Buffer): Uint8Array =>
  new Uint8Array(toArrayBuffer(buffer));

function hash(input: string): Buffer {
  return Buffer.from(
    blake
      .blake2bHex(bufferToUnit8Array(Buffer.from(input, "hex")), undefined, 32)
      .toString(),
    "hex",
  );
}

export { hash };
