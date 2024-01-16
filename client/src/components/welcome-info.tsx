import styled from 'styled-components'
import { FlexColCenter, FlexRowCenter} from './styles';
import Chainlink from '../assets/chainlink.png'
import Polygon from '../assets/polygon.png'
import { useAccountBalance } from '../hooks/use-account-balance';

const StyledWelcomeInfo = styled(FlexColCenter)`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    padding-top: 0;
    gap: 0;
`;

export const WelcomeInfo = () => {
  const accountBalance = useAccountBalance();

  if (parseFloat(accountBalance) > 0.02) {
    return null
  }
  return (
    <StyledWelcomeInfo>
      <FlexRowCenter>
        <img src={Chainlink} alt="heart" width="60px" height="60px" />
         {/* <P><a href="#" target="_blank">Learn how the CoinFlip works and why it is 100% provably fair here!</a></P> */}
        <a href="https://faucets.chain.link/mumbai" target="_blank">Get some Test Matic to participate!</a>
        <img src={Polygon} alt="chainlink" width="60px" height="60px" />
      </FlexRowCenter>
    </StyledWelcomeInfo>
  )
}
