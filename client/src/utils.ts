export const sliceAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  export const switchToPolygonMainnet = async () => {
    try {
        await window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{
            chainId: '0x89', // Chain ID for Polygon Mainnet
          }],
        });
    } catch {
      try {
        await window.ethereum?.request({
          "method": "wallet_addEthereumChain",
          "params": [
            {
              "chainId": "0x89",
              "chainName": "Polygon LlamaNodes",
              "rpcUrls": [
                "https://polygon.llamarpc.com"
              ],
              "iconUrls": [
                "https://xdaichain.com/fake/example/url/xdai.svg",
                "https://xdaichain.com/fake/example/url/xdai.png"
              ],
              "nativeCurrency": {
                "name": "MATIC",
                "symbol": "MATIC",
                "decimals": 18
              },
              "blockExplorerUrls": [
                "https://polygonscan.com"
              ]
            }
          ]
        })
      } catch {
        console.log('User did not want to switch to Polygon Mainnet!')
      }
    }
  };

  export const switchToPolygonMumbai = async () => {
    try {
        await window.ethereum?.request({
          method: 'wallet_switchEthereumChain',
          params: [{
            chainId: '0x13881', // Chain ID for Polygon Mainnet
          }],
        });
    } catch {
      try {
        await window.ethereum?.request({
          "method": "wallet_addEthereumChain",
          "params": [
            {
              "chainId": "0x13881",
              "chainName": "Mumbai",
              "rpcUrls": [
                "https://rpc-mumbai.maticvigil.com"
              ],
              "nativeCurrency": {
                "name": "MATIC",
                "symbol": "MATIC",
                "decimals": 18
              },
              "blockExplorerUrls": [
                "https://mumbai.polygonscan.com"
              ]
            }
          ]
        })
      } catch {
        console.log('User did not want to switch to Polygon Mumbai!')
      }
    }
  };