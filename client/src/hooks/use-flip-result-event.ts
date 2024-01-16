import { useEffect, useState } from 'react'
import { COINFLIP_ADDRESS, CONTRACT_ABI } from '../constants'
import { useContractWithJsonRpcProvider } from './use-contract-with-json-rpc-provider'
import { useSigner } from './use-signer'

export type FlipResult = {
    requestId: string
    player: string
    didWin: boolean
}

export const useFlipResultEvent = (): {flipResult?: FlipResult, resetFlipResult: () => void} => {
    const [flipResult, setFlipResult] = useState<{requestId: string, player: string, didWin: boolean}>()
    const contract = useContractWithJsonRpcProvider(COINFLIP_ADDRESS, CONTRACT_ABI)
    const signer = useSigner()

    const resetFlipResult = () => {
        setFlipResult(undefined)
    }

    useEffect(() => {
        if (!contract || !signer ) {
            return
        }
        contract.on('CoinFlip__FlipResult', (requestId, player, didWin) => {
            console.log("FlipResult", requestId, player, didWin)
            console.log(signer.address)
            if(player === signer.address) {
                setFlipResult({
                    requestId,
                    player,
                    didWin
                })
            }
        })

        return () => {
            contract.removeAllListeners('CoinFlip__FlipRequested')
        }
    }, [contract, signer])

  return { flipResult, resetFlipResult }
}
