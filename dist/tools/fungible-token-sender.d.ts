import { Amount } from "@radixdlt/radix-engine-toolkit";
declare class FungibleTokenSender {
    private networkId;
    private wallet;
    private constructor();
    static new(networkId: number, privateKey: string): Promise<FungibleTokenSender>;
    private build;
    send(toAddress: string, tokenAddress: string, amount: Amount): Promise<import("../models/result").Result>;
}
export { FungibleTokenSender };
