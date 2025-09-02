"use client";

import type { NextPage } from "next";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useAccount } from "wagmi";
import { BalanceDisplay } from "~~/components/BalanceDisplay";
import { useBatchBalances } from "~~/hooks/useBatchBalances";
import { useTokenPrices } from "~~/hooks/useTokenPrices";
import CompassIcon from "~~/icons/CompassIcon";
import DarkBugAntIcon from "~~/icons/DarkBugAntIcon";
import LightBugAntIcon from "~~/icons/LightBugAntIcon";
import { TOKENS } from "~~/utils/tokenConfig";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const prices = useTokenPrices();
  const [compareMode, setCompareMode] = useState<"batched" | "individual">("batched");
  const { balances, refetch } = useBatchBalances();

  // Calculate total portfolio value
  const totalValue = Object.keys(balances).reduce((total, symbol) => {
    const balance = balances[symbol]?.formatted || 0;
    const price = prices[symbol] || 0;
    return total + balance * price;
  }, 0);

  return (
    <>
      <div className="flex flex-col items-center p-6">
        <h1 className="mb-6 text-3xl font-bold">Portfolio Dashboard</h1>

        {/* Total Portfolio Value */}
        {totalValue > 0 && (
          <div className="w-full max-w-2xl p-4 mb-6 border rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 border-primary/30">
            <div className="text-center">
              <p className="mb-1 text-sm text-base-content/60">Total Portfolio Value</p>
              <p className="text-3xl font-bold text-primary">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="w-full max-w-2xl p-6 rounded-lg bg-base-200/[30%]">
          {!connectedAddress ? (
            <div className="py-8 text-center">
              <p className="mb-4 text-lg text-base-content/60">Connect your wallet to view your token balances</p>
              <div className="text-sm text-base-content/40">Use the connect button in the header to get started</div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Token Balances</h2>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    refetch();
                    setCompareMode(prev => (prev === "batched" ? "individual" : "batched"));
                  }}
                >
                  Switch to {compareMode === "batched" ? "Individual" : "Batched"} Mode
                </button>
              </div>

              <div className="mb-6 space-y-4">
                {compareMode === "individual" ? (
                  <div className="grid gap-4 md:grid-cols-1">
                    <div className="p-6 shadow-lg bg-base-100/[20%] rounded-xl">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          {isDarkMode ? <DarkBugAntIcon /> : <LightBugAntIcon />}
                          <h3 className="mt-1 text-xl font-bold">Individual Token Balances</h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {TOKENS.map(token => (
                          <div
                            key={token.address}
                            className="p-4 transition-colors rounded-lg bg-gradient-to-br from-primary/40 to-secondary/40"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex flex-col">
                                <span className="text-lg font-semibold">{token.symbol}</span>
                                <span className="text-sm text-base-content/60">{token.name}</span>
                              </div>
                              <div className="text-right">
                                <BalanceDisplay
                                  address={token.address as `0x${string}`}
                                  owner={connectedAddress as `0x${string}`}
                                  symbol={token.symbol}
                                  decimals={token.decimals}
                                  usdPrice={prices[token.symbol]}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-1">
                    <div className="p-6 shadow-lg bg-base-100/[20%] rounded-xl">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <CompassIcon />
                          <h3 className="mt-1 text-xl font-bold">Batched Token Balances</h3>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {Object.keys(balances).length === 0 ? (
                          <div className="py-8 text-center">
                            <p className="text-base-content/60">No balances found</p>
                          </div>
                        ) : (
                          Object.keys(balances).map(symbol => {
                            const token = TOKENS.find(t => t.symbol === symbol);
                            return (
                              <div
                                key={symbol}
                                className="p-4 transition-colors rounded-lg bg-gradient-to-br from-primary/40 to-secondary/40"
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex flex-col">
                                    <span className="text-lg font-semibold">{symbol}</span>
                                    <span className="text-sm text-base-content/60">
                                      {token?.name || "Unknown Token"}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    <div className="font-mono text-lg font-bold">
                                      {balances[symbol]?.formatted.toFixed(6)} {symbol}
                                    </div>
                                    {prices[symbol] && (
                                      <div className="text-sm text-base-content/60">
                                        ${(balances[symbol]?.formatted * prices[symbol]).toFixed(2)}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;
