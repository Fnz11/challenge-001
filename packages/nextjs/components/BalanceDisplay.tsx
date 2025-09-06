import { useReadContract } from "wagmi";

// ERC20 ABI - just the balanceOf function
const ERC20_ABI = [
  {
    type: "function",
    name: "balanceOf",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

type Props = {
  address: `0x${string}`;
  owner: `0x${string}`;
  symbol: string;
  decimals: number;
  usdPrice: number;
};

export const BalanceDisplay = ({ address, owner, symbol, decimals, usdPrice }: Props) => {
  const { data: balance, isLoading } = useReadContract({
    address: address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: [owner],
  });

  if (isLoading) {
    return (
      <div className="text-right">
        <div className="animate-pulse">
          <div className="w-20 h-5 mb-1 rounded bg-base-300"></div>
          <div className="w-16 h-3 rounded bg-base-300"></div>
        </div>
      </div>
    );
  }

  const formatted = balance ? Number(balance.toString()) / 10 ** decimals : 0;
  const usdValue = formatted * (usdPrice || 0);

  return (
    <div className="text-right">
      <div className="font-mono text-lg font-semibold">
        {formatted.toFixed(6)} {symbol}
      </div>
      {usdPrice && <div className="text-sm text-base-content/60">${usdValue.toFixed(2)}</div>}
    </div>
  );
};
