import { parseEther } from 'ethers';
import { CONTRACT_ABI, COINFLIP_ADDRESS } from '../constants';
import { useContract } from '../hooks/use-contract';
import { useSigner } from '../hooks/use-signer'
import { Button, P } from './styles';
import { useEntryFee } from '../hooks/use-entrance-fee';
import { useCallback } from 'react';
import Coin from '../assets/coinflip.png'
import { RotateAnimation } from './header';

export const FlipButton = ({setTxHash, setWaitForFlipResult}: {
    setTxHash: (txHash: string) => void;
    setWaitForFlipResult: (wait: boolean) => void;
}) => {
    const signer = useSigner();
    const contract = useContract(COINFLIP_ADDRESS, CONTRACT_ABI);
    const entranceFee = useEntryFee();

    const onBuyTicket = useCallback(async () => {
        if(contract && signer) {
        try {
            const tx = await contract.flip({ value: parseEther(entranceFee.toFixed(18)) });
            setTxHash(tx.hash);
            const receit = await tx.wait();

            if(receit && receit.status === 1) {
              setTxHash("")
              setWaitForFlipResult(true)
            }
        } catch (e) {
            console.error(e);
        }
        }
    }, [contract, entranceFee, setTxHash, setWaitForFlipResult, signer])

  if (!signer) {
    return null
  }

  return (
    <>
        <Button onClick={onBuyTicket}>
           <RotateAnimation>
            <img src={Coin} alt="coin" width={24} height={24} />
          </RotateAnimation>
          FLIP!
        </Button>
        <P>Price: {entranceFee} Matic</P>
        <P>Double or Nothing!</P>
        <P>You win 0.02 Matic or loose 0.01 Matic</P>
    </>
  )
}
