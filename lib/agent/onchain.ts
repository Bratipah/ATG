import { createPublicClient, http, formatUnits } from 'viem';
import {  somniaTestnet } from 'viem/chains';
import { contracts } from '@/lib/contracts';
import { TOKENS } from '@/lib/tokens';

const publicClient = createPublicClient({
  chain: somniaTestnet,
  transport: http(),
});

export interface OnChainState {
  riskParams: {
    maxRebalanceBps: bigint;
    volatilityThresholdBps: bigint;
    minRunwayMonths: bigint;
  };
  balances: {
    avaxBal: bigint;
    usdcBal: bigint;
    avaxAmt: number;
    usdcAmt: number;
  };
}

export async function getOnChainState(): Promise<OnChainState> {
  // 1. Read Risk Parameters from Chain
  const [maxRebalanceBps, volatilityThresholdBps, minRunwayMonths] = await Promise.all([
    publicClient.readContract({ address: contracts.riskParameters.address, abi: contracts.riskParameters.abi, functionName: 'maxRebalanceBps' }),
    publicClient.readContract({ address: contracts.riskParameters.address, abi: contracts.riskParameters.abi, functionName: 'volatilityThresholdBps' }),
    publicClient.readContract({ address: contracts.riskParameters.address, abi: contracts.riskParameters.abi, functionName: 'minRunwayMonths' }),
  ]) as [bigint, bigint, bigint];

  // 2. Read Treasury Balances
  const fujiTokens = TOKENS[somniaTestnet.id];
  const avaxToken = fujiTokens.find(t => t.symbol === 'WSOMI')!;
  const usdcToken = fujiTokens.find(t => t.symbol === 'USDC')!;
  // const usdtToken = fujiTokens.find(t => t.symbol === 'USDT')!;

  const [avaxBal, usdcBal] = await Promise.all([
    publicClient.readContract({ 
      address: contracts.treasuryVault.address, 
      abi: contracts.treasuryVault.abi, 
      functionName: 'balanceOf', 
      args: [avaxToken.address as `0x${string}`] 
    }),
    publicClient.readContract({ 
      address: contracts.treasuryVault.address, 
      abi: contracts.treasuryVault.abi, 
      functionName: 'balanceOf', 
      args: [usdcToken.address as `0x${string}`] 
    })
  ]) as [bigint, bigint];

  const avaxAmt = parseFloat(formatUnits(avaxBal, avaxToken.decimals));
  const usdcAmt = parseFloat(formatUnits(usdcBal, usdcToken.decimals));

  return {
    riskParams: {
      maxRebalanceBps,
      volatilityThresholdBps,
      minRunwayMonths
    },
    balances: {
      avaxBal,
      usdcBal,
      avaxAmt,
      usdcAmt
    }
  };
}




