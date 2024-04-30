import { useFetches } from "./UseFetches";
import { useTokenURIs } from "./useTokenURIs2";
import { erc721Abi } from "viem";
import { useChains, usePublicClient, useReadContract } from "wagmi";

const replacement = {
  ipfs: "https://ipfs.io/ipfs/",
  nftstorage: "https://nftstorage.link/ipfs/",
};

function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}
export const useTokens = (
  chainName: string,
  address: string,
  tokenIds: bigint[],
  replacementType: "ipfs" | "nftstorage" = "ipfs",
) => {
  const chains = useChains();

  let configuredChainName = chainName;
  configuredChainName = chainName.replaceAll("-", " ");
  configuredChainName = toTitleCase(configuredChainName);
  const selectedChain = chains.find(i => i.name === configuredChainName);

  const { data: collectionName } = useReadContract({
    abi: erc721Abi,
    address,
    functionName: "name",
    chainId: selectedChain?.id,
  });

  const { data: collectionSymbol } = useReadContract({
    abi: erc721Abi,
    address,
    functionName: "symbol",
    chainId: selectedChain?.id,
  });

  const publicClient = usePublicClient({ chainId: selectedChain?.id });

  const { uris } = useTokenURIs(publicClient, address, tokenIds);

  for (let i = 0; i < uris.length; i++) {
    uris[i] = uris[i].replace("ipfs://", replacement[replacementType]);
  }

  const { responses } = useFetches(uris);

  const tokens: any[] = [];
  for (let i = 0; i < responses.length; i++) {
    responses[i]
      ? (responses[i].image = responses[i].image.replace("ipfs://", replacement[replacementType]))
      : undefined;

    const token = {} as any;
    token.address = address;
    token.metadata = responses[i];
    token.id = tokenIds[i];
    token.uri = uris[i];
    token.collectionName = collectionName;
    token.collectionSymbol = collectionSymbol;
    tokens.push(token);
  }

  return tokens;
};