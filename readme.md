# Portfolio Dashboard - Challenge 001

**Live Demo:** [https://challenge-001-stylus.vercel.app/](https://challenge-001-stylus.vercel.app/)

## Overview

This is a modern cryptocurrency portfolio dashboard built with **Next.js**, **Arbitrum Stylus**, and **Wagmi**. The application allows users to connect their wallets and view token balances in real-time with USD valuations, featuring both individual and batched balance fetching modes.

## Features

### 🚀 Key Features
- **Wallet Connection**: Connect any Web3 wallet to view your portfolio
- **Multi-Token Support**: Supports USDe, WETH, and USDC tokens
- **Real-Time Pricing**: Live USD prices from CoinGecko API
- **Dual Display Modes**: Individual and Batched balance viewing
- **Portfolio Overview**: Total portfolio value calculation
- **Responsive Design**: Works seamlessly on desktop and mobile

### 📊 Supported Tokens
- **USDe (Ethena USDe)**: `0xf4BE938070f59764C85fAcE374F92A4670ff3877`
- **WETH (Wrapped Ethereum)**: `0x980B62Da83eFf3D4576C647993b0c1D7faf17c73`
- **USDC (USD Coin)**: `0xe97A5e6C4670DD6fDeA0B5C3E304110eB0e599d9`

## How Balance Display Works

The application implements two different methods for displaying token balances:

### 1. Individual Balance Display Mode

**File**: `packages/nextjs/components/BalanceDisplay.tsx`

**How it works**:
1. Uses `useReadContract` hook from Wagmi
2. Makes separate contract calls for each token
3. Calls the `balanceOf` function on each ERC-20 token contract
4. Converts raw balance using token decimals
5. Calculates USD value using real-time prices

```tsx
// Example flow:
1. User connects wallet → Gets wallet address
2. Component renders → Makes individual contract call
3. Contract call → balanceOf(userAddress)
4. Raw balance → Converts using decimals (balance / 10^decimals)
5. USD calculation → balance * tokenPrice
```

**Advantages**: 
- More granular control
- Individual error handling
- Real-time updates per token

### 2. Batched Balance Display Mode

**File**: `packages/nextjs/hooks/useBatchBalances.ts`

**How it works**:
1. Uses `multicall` functionality from Viem
2. Batches all token balance queries into a single RPC call
3. Processes all results simultaneously
4. Stores results in a unified state

```tsx
// Example flow:
1. User connects wallet → Gets wallet address
2. Hook executes → Creates batch of contract calls
3. Multicall → [balanceOf(token1), balanceOf(token2), balanceOf(token3)]
4. Single RPC call → Returns all balances at once
5. Process results → Convert and format all balances
6. Update state → All balances available immediately
```

**Advantages**:
- More efficient (single RPC call)
- Better performance
- Atomic updates (all or nothing)
- Reduced network requests

### 3. Price Fetching System

**File**: `packages/nextjs/hooks/useTokenPrices.ts`

**How it works**:
1. Fetches prices from CoinGecko API every 60 seconds
2. Maps token symbols to CoinGecko IDs
3. Provides fallback prices if API fails
4. Updates all components automatically when prices change

```tsx
// Price mapping:
USDe → usde (CoinGecko ID)
WETH → ethereum (CoinGecko ID) 
USDC → usd-coin (CoinGecko ID)
```

### 4. Portfolio Value Calculation

**File**: `packages/nextjs/app/page.tsx`

The total portfolio value is calculated by:
```tsx
totalValue = Σ(tokenBalance × tokenPrice) for all tokens
```

## Architecture Overview

### Frontend Stack
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Wagmi**: React hooks for Ethereum
- **Viem**: TypeScript interface for Ethereum
- **TanStack Query**: Data fetching and caching

### Usage

1. **Connect Your Wallet**
   - Click "Connect Wallet" in the header
   - Select your preferred wallet
   - Approve the connection

2. **View Your Balances**
   - Your token balances will load automatically
   - See individual token amounts and USD values
   - View your total portfolio value at the top

3. **Switch Display Modes**
   - Click "Switch to Individual/Batched Mode"
   - Compare the two different balance fetching methods
   - Notice the difference in loading behavior

## Technical Details

### Balance Precision
- All balances are displayed with 6 decimal places
- Raw blockchain values are converted using token decimals
- USD values are rounded to 2 decimal places

### Error Handling
- Network errors show user-friendly messages
- Failed balance fetches display "0.00" with retry option
- Price fetch failures use fallback values

### Performance Optimizations
- React Query caching for API responses
- Multicall for efficient blockchain queries
- Optimistic UI updates
- Lazy loading of components

**Built with ❤️ using Scaffold-ETH and Arbitrum Stylus**