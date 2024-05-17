import { mainnet, sepolia } from "wagmi/chains";

export const IS_PRODUCT_MODE = false

export const global = {
    PUBLIC_URL: "https://hpths777inutrumpos.com",
    PROJECT_ID: 'a3c9c3f31cb7a37922c19db87af0fc62',
    REFETCH_INTERVAL: 30000,
    chain: IS_PRODUCT_MODE ? mainnet : sepolia,
}