import { useCheckWindowEthereum } from '../hooks/use-check-window-ethereum';
import { useSigner } from '../hooks/use-signer'
import { Button, P } from './styles';

export const ConnectButton = () => {
    const signer = useSigner();
    const hasWindowEthereum = useCheckWindowEthereum();

    const onConnect = async () => {
      if(hasWindowEthereum) {
        await window.ethereum?.request({ method: 'eth_requestAccounts' });
      }
    }

    if (signer) {
        return null
    }
  return (
    <>
        <P>Connect your wallet to participate and interact with the DApp!</P>
        <Button onClick={onConnect}>Connect Wallet</Button>
    </>
  )
}
