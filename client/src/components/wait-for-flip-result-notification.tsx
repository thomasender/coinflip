import { H1, NotificationContainer, P } from './styles'
import styled from 'styled-components'
import { useCallback, useEffect } from 'react'
import { Polygon } from '../icons/polygon'
import Coin from '../assets/coinflip.png'
import { RotateAnimation } from './header'

export const BlurBackground = styled.div`
  position: fixed;
  z-index: 1000;
  background-color: rgba(0,0,0,0.8);
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items:center;
  justify-content: center;
`


export const WaitForFlipResultNotification = ({waitForFlipResult}: {waitForFlipResult: boolean}) => {
  const handleClick = useCallback((event: { stopPropagation: () => void }) => {
    event.stopPropagation();
  }, []);

  useEffect(() => {
    // Disable scrolling on the body element
    document.body.style.overflow = 'hidden';

    // Re-enable scrolling when the component is unmounted
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  if (!waitForFlipResult) return null
  return (
    <BlurBackground onClick={handleClick}>
      <NotificationContainer>
          <H1>Your Flip Result is calculating!</H1>
          <H1>Hold on to your seat!</H1>
          <RotateAnimation>
            <img src={Coin} alt="coin" width="60px" height="60px" />
          </RotateAnimation>
          <P>It may take a few minutes to complete.</P>
          <P>Do not close this window.</P>
          <Polygon />
      </NotificationContainer>
    </BlurBackground>
  )
}
