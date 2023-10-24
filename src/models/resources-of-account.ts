interface ResourcesOfAccount {
  address: string;
  fungible: { resourceAddress: string; amount: string }[];
  nonFungible: { resourceAddress: string; ids: string[] }[];
}

export { ResourcesOfAccount };
