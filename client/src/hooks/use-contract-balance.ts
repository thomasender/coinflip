import { useState, useEffect } from 'react'
import { BigNumberish, formatEther } from 'ethers';
import { useProvider } from './use-provider';
import { COINFLIP_ADDRESS } from '../constants';

export const useContractBalance = () => {
    const provider = useProvider()
    const [contractBalance, setContractBalance] = useState("");

    useEffect(() => {
        if(!provider) {
            return;
        }
        const getBalanceFromAddress = async () => {
            const balance: BigNumberish = await provider.getBalance(COINFLIP_ADDRESS);
            setContractBalance(formatEther(balance));
        }
        getBalanceFromAddress();
        const timer = setInterval(() => getBalanceFromAddress(), 1000);

        return () => clearInterval(timer);

    }, [provider]);
  return contractBalance;
}
