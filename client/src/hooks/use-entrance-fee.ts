import { useState, useEffect } from 'react'
import { useContract } from './use-contract';
import { BigNumberish, formatEther } from 'ethers';
import { CONTRACT_ABI, COINFLIP_ADDRESS } from '../constants';

export const useEntryFee = () => {
    const contract = useContract(COINFLIP_ADDRESS, CONTRACT_ABI);
    const [price, setPrice] = useState("");

    useEffect(() => {
        if(!contract) {
            return;
        }
        const getEntranceFee = async () => {
            const entranceFee: BigNumberish = await contract.getEntryFee();
            setPrice(formatEther(entranceFee));
        }

        getEntranceFee();
    }, [contract]);
  return parseFloat(price);
}
