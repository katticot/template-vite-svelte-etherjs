import ERC20 from '@openzeppelin/contracts/build/contracts/IERC20.json'

import {derived} from 'svelte/store'
import {defaultEvmStores} from 'svelte-web3'
import {connected, web3, selectedAccount, chainId, chainData} from 'svelte-web3'

defaultEvmStores.setProvider()

const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f'

const myContractStore = derived([web3, chainId], ([$web3, $chainId]) => {
    if ($chainId && $web3.eth) {
        // DO whaever nececessay to get address from chainId
        console.log('chainId is', $chainId)
        return new $web3.eth.Contract(ERC20.abi, DAI, {})
    }
    return null
})

export default myContractStore