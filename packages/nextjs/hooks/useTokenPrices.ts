import { useQuery } from "@tanstack/react-query";

type Prices = {
  [symbol: string]: number;
};

const fetchTokenPrices = async (): Promise<Prices> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/simple/price?ids=usde,ethereum,usd-coin&vs_currencies=usd",
  );

  if (!response.ok) {
    throw new Error("Failed to fetch prices");
  }

  const data = await response.json();
  return {
    USDe: data.usde.usd,
    WETH: data.ethereum.usd,
    USDC: data["usd-coin"].usd,
  };
};

export const useTokenPrices = () => {
  const { data: prices = { USDe: 1, WETH: 1, USDC: 1 } } = useQuery({
    queryKey: ["tokenPrices"],
    queryFn: fetchTokenPrices,
    refetchInterval: 60000,
  });

  return prices;
};
