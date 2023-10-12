import { Result } from "../models";
declare class XRDFaucet {
    static getXRD(toAddress: string): Promise<Result>;
}
export { XRDFaucet };
