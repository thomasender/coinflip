import { Button, H1, NotificationContainer } from './styles'
import styled from 'styled-components'
import { useCallback, useEffect } from 'react'
import { Polygon } from '../icons/polygon'
import Coin from '../assets/coinflip.png'
import { FlipResult } from '../hooks/use-flip-result-event'

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


export const FlipResultNotification = ({flipResult, resetFlipStatus}: {flipResult: FlipResult, resetFlipStatus: () => void}) => {
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

  const calcLabel = () => {
    if(flipResult.didWin) {
      return <>
        <H1>Congratulations! You Won!</H1>
        <img src="https://media.giphy.com/media/26u4cqiYI30juCOGY/giphy.gif" width="100%" />
      </>
    } else
    {
      return <>
        <H1>Bad Luck this time! Try again!</H1>
      <img src="https://media.giphy.com/media/5BLIUJbZfDzIPv0EpL/giphy.gif" width="100%"/>
      </>
    }
  }

  if (!flipResult) return null
  return (
    <BlurBackground onClick={handleClick}>
      <NotificationContainer>
          <img src={Coin} alt="clover" width="60px" height="60px" />
          {calcLabel()}
          <Button onClick={resetFlipStatus}>Close</Button>
          <Polygon />
      </NotificationContainer>
    </BlurBackground>
  )
}
