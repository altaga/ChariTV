# ChariTV

<img src="https://i.ibb.co/x2GcDdk/logo.png" >

<p>

ChariTV Description

# Watch our demo video:

<img src="https://i.ibb.co/j3DCtPZ/image.png" >

# Test the product:

## URL: https://main.d1su9u0306vtdi.amplifyapp.com

Use Polygon Mainnet on Metamask Wallet!!!!

- Get it on: https://metamask.io/

- Follow: https://academy.binance.com/en/articles/how-to-add-polygon-to-metamask

# Introduction and Problem



# Our Solution:

Description

# Diagram:

<img src="https://i.ibb.co/4KJFkF4/Untitled-Diagram-drawio.png" >

## Tech we Use:

- Polygon Network:
  - Interaction with donations contract to send donations and register donors.
    - Donation Contract Address:
      - https://polygonscan.com/address/0x5A330392e04bB9Daa204d920A3FEC277e181BB2f
    - Donation Smart Contract:
      - https://github.com/altaga/ChariTV/blob/main/WebPage/src/contracts/charity.js
  - NFTs:
    - NFT Contract Address:
      - https://polygonscan.com/token/0x781bb29563ae1cad7907439c0f58f5b7653c0b1f?a=0x00fa49df5566f1507677fd3f3aee87a49f463cd2
    - NFT SmartContract: 
      - https://github.com/altaga/ChariTV/blob/main/WebPage/src/contracts/nftContract.js
- Covalent:
  - Obtaining account MATIC Balance.
  - Obtaining account NFTs Balances.
  - We get the contracts from the NFTs.
- Streamr Network:
  - Websocket Service:
    - Publish:
      - Mandar mensajes al chat general
    - Subscribe:
      - Recibir los mensajes del chat general
      - Recibir notificaciones de DM.
    - Streamr Node:
      - https://streamr.network/network-explorer/nodes/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%23ca258d52-2abf-4dc2-b9cf-dfdeed921e121
    - Streamr streams:
      - https://streamr.network/network-explorer/streams/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%2FChariTV
- XMTP:
  - XMTP Client:
    - Sign in para autenticacion a la conversacion privada.
    - Mandar mensajes directos a travez de un chat privado.
    - Obtener el historial de mensajes con la misma cuenta.
- Livepeer:
  - RTMP URL:
    - Url para transmitir facilmente desde el OBS y empezar nuestra transmision.
  - Livestreams and Recordings API:
    - Obtencion de el url si un streamr esta en live.
    - Obtencion del ultimo record de cada streamer si esta offline.

# How it's built:

## Polygon Network:

<img src="https://i.ibb.co/m8fNPS9/Image.png" >

The Polygon network was used to deploy all the contracts, both the contracts of all the NFTs and the main donations contract, in this case it was designed for its speed and low fees, making it easily scalable to carry out an effective charity campaigns.

El contrato de donaciones nos permite generar un contrato que junta todo el dinero donado en si mismo, realiza un registro de cada uno de los donantes y finalmente tranferir todo el dinero recolectado a el public address de la campaña.

<img src="https://i.ibb.co/vVVHWpS/image.png">

https://github.com/altaga/ChariTV/blob/main/WebPage/src/contracts/charity.js

En el caso de los NFTs estos son repartidos despues del streaming, tomando en cuenta las donaciones realizadas y la cantidad.

<img src="https://i.ibb.co/Lztyvq1/image.png">

https://github.com/altaga/ChariTV/blob/main/WebPage/src/contracts/nftContract.js

## Covalent Network:

<img src="https://i.ibb.co/b7Lzv2p/Image.png" >

## Covalent:

Our application by requiring that we quickly look up the balance of our Contract and in turn if it has NFT's in it, we were able to find a way to do it efficiently from the Covalent API's.

Get Balance:
    
    let amount = await fetchAsyncBalance(`https://api.covalenthq.com/v1/137/address/${this.context.value.contractAddress}/balances_v2/?key=${process.env.REACT_APP_Covalent}`)
        this.setState({
            amount
        })

Code URL: https://github.com/altaga/ChariTV/blob/main/WebPage/src/components/summary.js

Get NFT's:

    async syncNFT(address) {
        let contractsNFT = []
        let temp = await axios({
            method: 'get',
            url: `https://api.covalenthq.com/v1/137/address/${address}/balances_v2/?key=${process.env.REACT_APP_Covalent}&format=JSON&nft=true&no-nft-fetch=false`,
            headers: {
                'Accept': 'application/json'
            }
        })
        temp = temp.data.data.items.filter(item => item.type === "nft");

        temp = temp.map(item => {
            return ({
                contractAddress: item.contract_address
            })
        })

        let provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_Alchemy}`);
        temp.forEach((item) => {
            if (item.contractAddress !== "") {
                contractsNFT.push(new ethers.Contract(item.contractAddress, abi2(), provider))
            }
        })
        let res = []
        for (let i = 0; i < contractsNFT.length; i++) {
            try {
                temp = await contractsNFT[i].tokenURI("0");
                temp = await fetch(ipfsTohtml(temp))
                temp = await temp.json()
                temp.image = ipfsTohtml2(temp.image ? temp.image : temp.file)
                temp.contract = contractsNFT[i]
                res.push(temp)
            }
            catch {
                // nothing
            }
        }
        if (this.state.nfts.length !== res.length) {
            this.setState({
                nfts: res
            })
        }
    }

Code URL: https://github.com/altaga/ChariTV/blob/main/WebPage/src/components/header.js

## Streamr Network:

Para poder realizar nuestro Websocket de Streamr en nuestro chat en vivo tuvimos que primero configurar un Servidor en AWS como Nodo en la red de Streamr Network, como pueden ver en el siguiente URL ese es nuestro nodo.

https://streamr.network/network-explorer/nodes/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%23ca258d52-2abf-4dc2-b9cf-dfdeed921e121



## XMTP:

## XMTP:

## Livepeer:
 
# References

https://www.twitch.tv/creatorcamp/en/connect-and-engage/charity-streaming/

https://www.donordrive.com/charity-streaming/

https://www.youtube.com/watch?v=Hh4T4RuK1H8
