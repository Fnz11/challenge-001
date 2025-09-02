import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import { TOKENS } from "~~/utils/tokenConfig";
import { erc20Abi, Address } from "viem";

type BalanceData = {
  [symbol: string]: { value: bigint; formatted: number };
};

const fetchBatchBalances = async (address: Address, publicClient: any): Promise<BalanceData> => {
  if (!address || !publicClient) {
    throw new Error("Address or public client not available");
  }

  const calls = TOKENS.map(token => ({
    address: token.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  }));

  const results = await publicClient.multicall({ contracts: calls });

  const data: BalanceData = {};
  results.forEach(
    (
      result: {
        result: bigint;
        status: string;
      },
      i: number,
    ) => {
      const token = TOKENS[i];
      const value = result.status === "success" ? result.result : 0n;
      const formatted = Number(value) / 10 ** token.decimals;
      data[token.symbol] = { value: value, formatted };
    },
  );
  console.warn("BALANCE RESULT: ", {
    results,
    data,
  });
  return data;
};

export const useBatchBalances = () => {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const {
    data: balances = {},
    isLoading: loading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["batchBalances", address, publicClient?.chain?.id],
    queryFn: () => fetchBatchBalances(address!, publicClient!),
    enabled: !!address && !!publicClient,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 10000, // Consider data stale after 10 seconds
    retry: 2,
    retryDelay: 1000,
  });

  return { balances, loading, refetch, error };
};
