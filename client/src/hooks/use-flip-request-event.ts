import { useEffect, useState } from 'react'
import { COINFLIP_ADDRESS, CONTRACT_ABI } from '../constants'
import { useContractWithJsonRpcProvider } from './use-contract-with-json-rpc-provider'

export const useFlipRequestedEvent = () => {
    const [event, setEvent] = useState<{requestId: string}>()
    const contract = useContractWithJsonRpcProvider(COINFLIP_ADDRESS, CONTRACT_ABI)

    useEffect(() => {
        if (!contract) {
            return
        }

        contract.on('CoinFlip__FlipRequested', (requestId) => {
            setEvent({
               requestId
            })
        })

        return () => {
            contract.removeAllListeners('CoinFlip__FlipRequested')
        }
    }, [contract])

  return event
}
