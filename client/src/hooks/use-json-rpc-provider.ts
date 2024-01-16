import { JsonRpcProvider, ethers } from 'ethers';
import { useState, useEffect } from 'react'

export const useJsonRpcProvider = () => {
      const [jsonRpcProvider, setJsonRpcProvider] = useState<JsonRpcProvider>();

        useEffect(() => {
            const getProvider = async () => {
                if (window.ethereum == null) {
                    console.log("MetaMask not installed; using read-only defaults")
                } else {
                    // Connect to the MetaMask EIP-1193 object. This is a standard
                    // protocol that allows Ethers access to make all read-only
                    // requests through MetaMask.
                    setJsonRpcProvider(new ethers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com"))
                }
            }
            
            getProvider();
        }, []);
  return jsonRpcProvider
}
