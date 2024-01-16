import styled, {keyframes} from 'styled-components'
import { H1 } from './styles'
import Coin from '../assets/coinflip.png'

const HeaderContainer = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  gap: 24px;
`

const rotateKeyframes = keyframes`
    from {
        transform: rotateY(0deg);
    }
    to {
        transform: rotateY(359deg);
    }
`

export const RotateAnimation = styled.div`
    display: flex;
    animation: ${rotateKeyframes} 10s linear infinite;
`;

export const Header = () => {
  return (
    <HeaderContainer>
        <RotateAnimation>
          <img src={Coin} alt="clover" width="60px" height="60px" />
        </RotateAnimation>
        <H1>Welcome to the fair CoinFlip!</H1>
    </HeaderContainer>
  )
}
