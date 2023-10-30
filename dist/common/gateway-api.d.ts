import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
declare const NETWORK_API: {
    STOKENET_API: GatewayApiClient;
    MAINNET_API: GatewayApiClient;
};
declare function setNetwork(networkId: number, isDefault: boolean, customBasePath?: string): void;
export { NETWORK_API, setNetwork };
