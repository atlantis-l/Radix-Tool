/// <reference types="node" />
import { Result } from "neverthrow";
declare const bufferToUnit8Array: (buffer: Buffer) => Uint8Array;
declare const blake2b: (input: Buffer) => Result<Buffer, Error>;
export { bufferToUnit8Array, blake2b };
