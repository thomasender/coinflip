import { useTimeLeftTillNextDraw } from '../hooks/use-time-left-till-next-draw';
import { FlexColCenter, P } from './styles';

export const Countdown = () => {
  const timeLeft = useTimeLeftTillNextDraw();

  const { days, hours, minutes, seconds } = timeLeft || {};
  if (!timeLeft || !days && !hours && !minutes && !seconds) {
    return null;
  }

  return (
    <FlexColCenter>
      <div>
        <P>
          The next draw is in 
        </P>
        <P>
          {days ? `${days} Days ` : null}{hours ? `${hours} Hours ` : null}{minutes ? `${minutes} Minutes ` : null}{seconds ? `${seconds} Seconds` : null}
        </P>
      </div>
    </FlexColCenter>
  );
};

export default Countdown;