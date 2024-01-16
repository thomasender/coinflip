import { useState, useEffect } from 'react'
import { Contract } from 'ethers';
import { useProvider } from './use-provider';
import { useSigner } from './use-signer';

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


export const useContract = (contractAddress: string, abi: ContractABI) => {
    const provider = useProvider();
    const signer = useSigner();
    const [contract, setContract] = useState<Contract | null>(null);
      useEffect(() => {
        if (!provider || !signer) {
        return;
        }

        const getContract = async () => {
        const contract = new Contract(
            contractAddress,
            abi,
            signer
        );
        setContract(contract);
        };
        getContract();
    }, [provider, signer, abi, contractAddress]);

  return contract;
}
