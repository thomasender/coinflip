import { ContainerCloseButton, H1, NotificationContainer } from './styles'
import CloverPNG from '../assets/clover.png'
import Heart from '../assets/heart.png'

export const TicketBoughtNotification = ({closeMe}: {closeMe: () => void}) => {
  return (
    <NotificationContainer>
        <ContainerCloseButton onClick={closeMe}>Close</ContainerCloseButton>
                  <img src={CloverPNG} alt="clover" width="60px" height="60px" />
        <H1>You're in! Good Luck for the draw!</H1>
                  <img src={Heart} alt="heart" width="60px" height="60px" />
    </NotificationContainer>
  )
}
