import TreasuryVaultABI from './abis/TreasuryVault.json';
import ActionExecutorABI from './abis/ActionExecutor.json';
import RiskParametersABI from './abis/RiskParameters.json';
import AgentAuthABI from './abis/AgentAuth.json';
import PermissionManagerABI from './abis/PermissionManager.json';
import MockSwapABI from './abis/MockSwap.json';

export const contracts = {
  treasuryVault: {
    address: (process.env.NEXT_PUBLIC_TREASURY_VAULT_ADDRESS as `0x${string}`) || "0x6935B8ADD1ad176b73370F45b603Df30a303EF02",
    abi: TreasuryVaultABI.abi,
  },
  actionExecutor: {
    address: (process.env.NEXT_PUBLIC_ACTION_EXECUTOR_ADDRESS as `0x${string}`) || "0x7fE17fCd269B07404062f42aCf6e1f131086C97F",
    abi: ActionExecutorABI.abi,
  },
  riskParameters: {
    address: (process.env.NEXT_PUBLIC_RISK_PARAMETERS_ADDRESS as `0x${string}`) || "0x995BC7ddeDB7B869cEd9ef3698D0272e2d177A9C",
    abi: RiskParametersABI.abi,
  },
  agentAuth: {
    address: (process.env.NEXT_PUBLIC_AGENT_AUTH_ADDRESS as `0x${string}`) || "0xc2dFD5Cb92decB685787cEDC536046CBC251fe2A", 
    abi: AgentAuthABI.abi,
  },
  permissionManager: {
    address: (process.env.NEXT_PUBLIC_PERMISSION_MANAGER_ADDRESS as `0x${string}`) || "0x3dBBd27D26d2AA3ed321A785C0513969f1fB23B8",
    abi: PermissionManagerABI.abi,
  },
  mockSwap: {                                                           
    address: (process.env.NEXT_PUBLIC_MOCK_SWAP_ADDRESS as `0x${string}`) || "0x35A4E34953dC9720223607921891Fc67a857A84C",
    abi: MockSwapABI.abi,
  }
} as const;
