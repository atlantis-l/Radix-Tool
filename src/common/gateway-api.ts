import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";

const APP_NAME = "Radix Tool";

const STOKENET_API = GatewayApiClient.initialize({
  basePath: "https://stokenet.radixdlt.com/",
  applicationName: APP_NAME,
});

const MAINNET_API = GatewayApiClient.initialize({
  basePath: "https://mainnet.radixdlt.com/",
  applicationName: APP_NAME,
});

export { MAINNET_API, STOKENET_API };
