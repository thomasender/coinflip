import { useEffect, useState } from 'react'
import { useContract } from './use-contract'
import { CONTRACT_ABI, COINFLIP_ADDRESS } from '../constants';

type RaffleState = 0 | 1;

export const RAFFLESTATE: Record<RaffleState, string> = {
    0: "Open",
    1: "Calculating",
}

// We need to poll this every second to not miss the draw
const POLL_INTERVAL_IN_MS = 1000;

export const useRaffleState = () => {
    const contract = useContract(COINFLIP_ADDRESS, CONTRACT_ABI)
    const [raffleState, setRaffleState] = useState<string>(RAFFLESTATE[0]);

    useEffect(() => {
        if (!contract) {
            return
        }
        const getRaffleState = async () => {
            const raffleState = await contract.getRaffleState();
            setRaffleState(RAFFLESTATE[Number(raffleState) as RaffleState]);
        }
        getRaffleState()

        const timer = setInterval(() => {
            getRaffleState()
        }, POLL_INTERVAL_IN_MS)

        return () => clearInterval(timer)

    }, [contract])

    return raffleState
}

