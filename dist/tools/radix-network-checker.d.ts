import { ResourcesOfAccount } from "../models";
declare class RadixNetworkChecker {
    networkId: number;
    constructor(networkId: number);
    checkEntities(addresses: string[]): Promise<import("@radixdlt/babylon-gateway-api-sdk").StateEntityDetailsResponse>;
    checkResourcesOfAccounts(addresses: string[]): Promise<ResourcesOfAccount[]>;
    checkTransaction(transactionId: string): Promise<import("@radixdlt/babylon-gateway-api-sdk").TransactionCommittedDetailsResponse>;
}
export { RadixNetworkChecker };
