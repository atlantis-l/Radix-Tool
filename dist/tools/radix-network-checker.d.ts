declare class RadixNetworkChecker {
    networkId: number;
    private NETWORK_API;
    constructor(networkId: number);
    setNetworkId(networkId: number): void;
    checkEntities(addresses: string[]): Promise<import("@radixdlt/babylon-gateway-api-sdk").StateEntityDetailsResponse>;
    checkTransaction(transactionId: string): Promise<import("@radixdlt/babylon-gateway-api-sdk").TransactionCommittedDetailsResponse>;
}
export { RadixNetworkChecker };
