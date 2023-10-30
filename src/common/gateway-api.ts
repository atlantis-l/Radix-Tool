import { GatewayApiClient } from "@radixdlt/babylon-gateway-api-sdk";
import { NetworkId } from "@radixdlt/radix-engine-toolkit";

const APP_NAME = "Radix Tool";

const STOKENET_BASE_PATH = "https://stokenet.radixdlt.com/";

const MAINNET_BASE_PATH = "https://mainnet.radixdlt.com/";

const NETWORK_API = {
  STOKENET_API: GatewayApiClient.initialize({
    basePath: STOKENET_BASE_PATH,
    applicationName: APP_NAME,
  }),

  MAINNET_API: GatewayApiClient.initialize({
    basePath: MAINNET_BASE_PATH,
    applicationName: APP_NAME,
  }),
};

function setNetwork(
  networkId: number,
  isDefault: boolean,
  customBasePath?: string,
) {
  if (networkId === NetworkId.Mainnet) {
    NETWORK_API.MAINNET_API = GatewayApiClient.initialize({
      basePath: isDefault ? MAINNET_BASE_PATH : customBasePath,
      applicationName: APP_NAME,
    });
  } else if (networkId === NetworkId.Stokenet) {
    NETWORK_API.STOKENET_API = GatewayApiClient.initialize({
      basePath: isDefault ? STOKENET_BASE_PATH : customBasePath,
      applicationName: APP_NAME,
    });
  }
}

export { NETWORK_API, setNetwork };
