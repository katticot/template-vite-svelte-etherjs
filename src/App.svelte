<script>
    import logo from './assets/svelte.png'
    import Counter from './lib/Counter.svelte'
    import TailwindCss from './TailwindCSS.svelte';
    import {Card, StarRating} from 'attractions';
    import Fa from 'svelte-fa'
    import {faGem} from '@fortawesome/free-solid-svg-icons'
    import ABI from "../src/assets/abi/JeanCode.json"

    import Web3 from 'web3'
    import {ethers} from 'ethers'

    let restaurantRating = 1;
    //import {connected, Web3, selectedAccount, chainId, chainData,} from 'svelte-web3'

    import {Balance} from 'svelte-web3/components'

    $: metamaskConnected = window.ethereum ? window.ethereum.isConnected() : false
    window.ethereum
        .request({
            method: "eth_requestAccounts",
        })
    let accountValue
    const web3 = new Web3(window.ethereum)
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    console.log("web3", Web3)
    console.log("web32", web3)

    let address = window.ethereum.selectedAddress

    async function balance() {
        const contract = new ethers.Contract(
            "0xb7307F915bF01e44f737615Ef826b6A4FA03930C",
            ABI.abi,
            provider
        );
        contract.connect(provider)
        return (await contract.balanceOf(address)).toNumber()
    }

    let promise = balance()
</script>
<TailwindCss/>

<main class="max-w mx-auto px-4 bg-blue-900 shadow-lg hover:bg-white">
    <img src={logo} alt="Svelte Logo"/>
    <h1>Hello Typescript!</h1>

    <Counter/>

    <p>
        Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte
        Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte
        apps.
    </p>

    <p>
        Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a> for
        the officially supported framework, also powered by Vite!
    </p>
    <Card>

        <StarRating name="restaurant" bind:value={restaurantRating}/>
        <br>
        <StarRating name="hotel" value={5} max={7}>
            <span slot="icon"><Fa icon={faGem}/></span>
        </StarRating>
    </Card>
    {address}
    {#await promise then value}
        <p>the value is {value}</p>
    {/await}

</main>

<style>
    :root {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }

    main {
        text-align: center;
        padding: 1em;
        margin: 0 auto;
    }

    img {
        height: 16rem;
        width: 16rem;
    }

    h1 {
        color: #ff3e00;
        text-transform: uppercase;
        font-size: 4rem;
        font-weight: 100;
        line-height: 1.1;
        margin: 2rem auto;
        max-width: 14rem;
    }

    p {
        max-width: 14rem;
        margin: 1rem auto;
        line-height: 1.35;
    }

    @media (min-width: 480px) {
        h1 {
            max-width: none;
        }

        p {
            max-width: none;
        }
    }
</style>
