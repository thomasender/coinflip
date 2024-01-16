import { ContractABI } from "./hooks/use-contract";
import ABI from "./coinflip-abi.json"

// OWNER: 0x7B3594AA123CFdFE16fb2d9122D86E34E76B8749
// MUMBAI Address: 0x814B8B83e049143785b8cCA1944E84449719a80c (EntryFee 0.01 MATIC)
export const COINFLIP_ADDRESS = "0x814B8B83e049143785b8cCA1944E84449719a80c";
export const CONTRACT_ABI = ABI as ContractABI;
// Mumbai Testnet TX BASE URL: https://mumbai.polygonscan.com/tx/
// Mainnet TX BASE URL: https://polygonscan.com/tx/
export const ETHERSCAN_POLYGON_BASE_URL = "https://polygonscan.com/"
export const ETHERSCAN_POLYGON_TX_BASE_URL = `${ETHERSCAN_POLYGON_BASE_URL}tx/`
export const ETHERSCAN_POLYGON_ADDRESS_BASE_URL = `${ETHERSCAN_POLYGON_BASE_URL}address/`
export const ETHERSCAN_MUMBAI_POLYGON_TX_BASE_URL = "https://mumbai.polygonscan.com/tx/"
export const POLYGON_MUMBAI_CHAIN_ID = 80001;
export const POLYGON_MAINNET_CHAIN_ID = 137;

export const POLL_INTERVAL_IN_MS = 5000;
export const NEXT_DRAW_INTERVAL_IN_MS = 1800000;