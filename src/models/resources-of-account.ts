interface ResourceInfo {
  resourceAddress: string;
  symbol: string;
  name: string;
  amount?: string;
  ids?: string[];
}

interface ResourcesOfAccount {
  address: string;
  fungible: ResourceInfo[];
  nonFungible: ResourceInfo[];
}

export { ResourcesOfAccount, ResourceInfo };
