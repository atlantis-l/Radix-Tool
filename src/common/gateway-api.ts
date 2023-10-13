import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";

const APP_NAME = "Radix Tool";

const NETWORK_API = {
  STOKENET_API: GatewayApiClient.initialize({
    basePath: "https://stokenet.radixdlt.com/",
    applicationName: APP_NAME,
  }),

  MAINNET_API: GatewayApiClient.initialize({
    basePath: "https://mainnet.radixdlt.com/",
    applicationName: APP_NAME,
  }),
};

export { NETWORK_API };
