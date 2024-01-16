import { useState, useEffect } from 'react'
import { Contract } from 'ethers';
import { useJsonRpcProvider } from './use-json-rpc-provider';

export type ContractABI = Array<{
    type: string;
    inputs?: Array<{
      name: string;
      type: string;
      internalType: string;
    }>;
    outputs?: Array<{
      name: string;
      type: string;
      internalType: string;
    }>;
    stateMutability?: string;
    name?: string;
    anonymous?: boolean;
    indexed?: boolean;
  }>;


export const useContractWithJsonRpcProvider = (contractAddress: string, abi: ContractABI) => {
    const jsonRpcProvider = useJsonRpcProvider();
    const [contract, setContract] = useState<Contract | null>(null);
      useEffect(() => {
        if (!jsonRpcProvider) {
        return;
        }

        const getContract = async () => {
        const contract = new Contract(
            contractAddress,
            abi,
            jsonRpcProvider
        );
        setContract(contract);
        };
        getContract();
    }, [jsonRpcProvider, abi, contractAddress]);

  return contract;
}
