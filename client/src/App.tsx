import { useState } from "react";
import { ConnectButton } from "./components/connect-button";
import { Header } from "./components/header";
import { AppFrame, Button, H1, InfoBoxBordered, P } from "./components/styles";
import { ThemeToggler } from "./components/theme-toggler";
import { WelcomeInfo } from "./components/welcome-info";
import { useCheckWindowEthereum } from "./hooks/use-check-window-ethereum";
import { Polygon } from "./icons/polygon";
import { switchToPolygonMumbai } from "./utils";
import { POLYGON_MUMBAI_CHAIN_ID } from "./constants";
import { useChainId } from "./hooks/use-chain-id";
import { useOnChainChanged } from "./hooks/use-on-chain-changed";
import { useOnAccountsChanged } from "./hooks/use-on-accounts-changed";
import { TransactionNotification } from "./components/tx-notification";
import { Footer } from "./components/footer";
import { FlipButton } from "./components/flip-button";
import { useFlipResultEvent } from "./hooks/use-flip-result-event";
import { WaitForFlipResultNotification } from "./components/wait-for-flip-result-notification";
import { FlipResultNotification } from "./components/flip-result-notification";
import { useAccountBalance } from "./hooks/use-account-balance";

function App() {
    const [txHash, setTxHash] = useState<string | null>(null);
    const [waitForFlipResult, setWaitForFlipResult] = useState(false)
    const hasWindowEthereum = useCheckWindowEthereum();
    const chainId = useChainId();
    const accountBalance = useAccountBalance();

    useOnChainChanged();
    useOnAccountsChanged();

    const { flipResult, resetFlipResult } = useFlipResultEvent();

    const resetFlipStatus = () => {
      setTxHash(null);
      setWaitForFlipResult(false);
      resetFlipResult();
    }

  if (!hasWindowEthereum) {
    return <>
    <H1>Ooops!</H1>
    <h2>Looks like there is no Web3 Provider available!</h2>
    <p>Please <a href="https://metamask.io" target="_blank">install MetaMask</a> to interact with this DApp!</p>
    </>
  }

  if (chainId !== POLYGON_MUMBAI_CHAIN_ID) {
    return (
      <>
        <H1>Ooops!</H1>
        <h2>Looks like you are not connected to Polygon Mumbai!</h2>
        <Polygon />
        <p>Please switch to the Polygon Mumbai to interact with this DApp!</p>
        <Button onClick={switchToPolygonMumbai}>Switch to Mumbai Now!</Button>
      </>
    )
  }

  return (
    <AppFrame>
      <ThemeToggler />
      <Header />
      <InfoBoxBordered>
        <P>Your Balance: {accountBalance} Matic</P>
        <ConnectButton />
        <FlipButton setTxHash={setTxHash} setWaitForFlipResult={setWaitForFlipResult} />
      </InfoBoxBordered>
      <WelcomeInfo />
      {txHash ? <TransactionNotification txHash={txHash} /> : null}
      {!flipResult && waitForFlipResult ? <WaitForFlipResultNotification waitForFlipResult={waitForFlipResult} /> : null}
      {flipResult ? <FlipResultNotification flipResult={flipResult} resetFlipStatus={resetFlipStatus} /> : null}
      <Footer />
    </AppFrame>
  )
}

export default App
