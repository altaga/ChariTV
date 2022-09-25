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

NOTA: Si van a realizar una donacion de prueba recuerden modificar la cantidad de gas en Metamask a Low, Medium or High, sino la transaccion funcionara.

<img src="https://i.ibb.co/NsWRtQH/New-Project.png">

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

Code: https://github.com/altaga/ChariTV/blob/main/WebPage/src/contracts/charity.js

<img src="https://i.ibb.co/vVVHWpS/image.png">

En el caso de los NFTs estos son repartidos despues del streaming, tomando en cuenta las donaciones realizadas y la cantidad.

Code: https://github.com/altaga/ChariTV/blob/main/WebPage/src/contracts/nftContract.js

<img src="https://i.ibb.co/Lztyvq1/image.png">

## Covalent:

<img src="https://i.ibb.co/b7Lzv2p/Image.png" >

Our application by requiring that we quickly look up the balance of our Contract and in turn if it has NFT's in it, we were able to find a way to do it efficiently from the Covalent API's.

Get Balance:

Code: https://github.com/altaga/ChariTV/blob/main/WebPage/src/components/summary.js
    
    let amount = await fetchAsyncBalance(`https://api.covalenthq.com/v1/137/address/${this.context.value.contractAddress}/balances_v2/?key=${process.env.REACT_APP_Covalent}`)
        this.setState({
            amount
        })

Get NFT's:

Code: https://github.com/altaga/ChariTV/blob/main/WebPage/src/components/header.js

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

## Streamr Network:

<img src="https://i.ibb.co/Y3rx6r6/image.png" >

Para poder realizar nuestro Websocket de Streamr en nuestro chat en vivo tuvimos que primero configurar un Servidor en AWS como Nodo en la red de Streamr Network, como pueden ver en el siguiente URL ese es nuestro nodo.

https://streamr.network/network-explorer/nodes/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%23ca258d52-2abf-4dc2-b9cf-dfdeed921e121

Node Docs: https://streamr.network/docs/streamr-network/installing-broker-node

Una vez configurado el nodo y configurar los puertos correspondientes en nuestro server obtendremos un WebSocket que podremos consumir en nuestra app, sin embargo aun tendremos que crear el Stream en https://streamr.network/core/streams/ sino al tratar de publicar en el websocket no funcionara.

<img src="https://i.ibb.co/wCGqYm7/image.png" >

Ahora un ultimo reto que tenemos que resolver es como consumir el WebSocket en un ambiente de produccion, ya que el WebSocket que hemos creado funciona sin un certificado SSL, asi que tendremos dos opciones, instalarle un certificado al server o realizar un tunnel desde el servidor a una URL segura, tomando la ventaja que el nodo puede correr mediante un contenedor de docker, me parecio mas sensato usar un orquestador de contenedores para manejar ambos servicios en el server facilmente.

Docker Compose Files: https://github.com/altaga/ChariTV/tree/main/StreamrDockerCompose

    version: '3.1'
    services:
    streamr:
        image: streamr/broker-node:latest
        networks:
        - my-net
        volumes:
        - /home/ubuntu/streamrfiles:/root/.streamr

    ngrox:
        image: ngrok/ngrok:latest
        entrypoint: ngrok http streamr:7170
        networks:
        - my-net
        environment:
        NGROK_AUTHTOKEN: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        depends_on:
        - streamr

    networks:
    my-net:
        driver: bridge

Resumiendo, el primer servicio es el Broker Node de Streamr Network, el servicio para realizar el tunel seguro es Ngrok y ambos estan conectados a la misma red dentro del orquestador.

<img src="https://i.ibb.co/M6kc1ww/dockercompose-drawio.png" >

Dentro de nuestra app el codigo que recibe y manda los mensajes al chat es el siguinte.

Code: https://github.com/altaga/ChariTV/blob/main/WebPage/src/components/chat.js

    connectSub() {
        this.socketSub = new WebSocket(`${process.env.REACT_APP_StreamrWSS}/streams/${encodeURIComponent("0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5/ChariTV")}/subscribe?apiKey=${process.env.REACT_APP_StreamrAPI}`)
        this.socketSub.addEventListener('open', () => {
            this.setState({
                readySub: true
            })
        })
        this.socketSub.addEventListener('message', (message) => {
            if (!(JSON.parse(message.data).dm)) {
                let temp = this.state.history
                // Filter Duplicates
                if (
                    this.state.history[this.state.history.length - 1].address !== JSON.parse(message.data).address ||
                    this.state.history[this.state.history.length - 1].message !== JSON.parse(message.data).message
                ) {
                    temp.push(JSON.parse(message.data))
                    this.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
                }
                this.setState({
                    history: temp
                })
            }
            if (JSON.parse(message.data).dm && this.context.value.address !== "" && this.context.value.address === JSON.parse(message.data).to && !this.state.dm) {
                let temp = this.context.value.chatNotif
                temp.push(JSON.parse(message.data))
                this.context.setValue({
                    chatNotif:temp
                })
                this.audio.play()
            }
        })
        this.socketSub.addEventListener('close', () => {
            this.setState({
                readySub: false
            }, () => setTimeout(() => {
                this.connectSub()
            }, 5000))
        })

    }

    connectPub() {
        this.socketPub = new WebSocket(`${process.env.REACT_APP_StreamrWSS}/streams/${encodeURIComponent("0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5/ChariTV")}/publish?apiKey=${process.env.REACT_APP_StreamrAPI}`)
        this.socketPub.addEventListener('open', () => {
            this.setState({
                readyPub: true
            })
        })
        this.socketPub.addEventListener('close', () => {
            this.connectPub()
            this.setState({
                readyPub: false
            }, () => setTimeout(() => {
                this.connectPub()
            }, 5000))
        })
    }

## XMTP:

<img src="https://i.ibb.co/hDCgc3S/image.png" >

Debido a que nuestra app requiere un servicio confiable para realizar un chat privado se decidio incluir el Client de XMTP para realizar los mensajes privados entre donadores.

Code: https://github.com/altaga/ChariTV/blob/main/WebPage/src/components/chat.js

Este servicio tiene 3 partes fundamentales, realizar un sign in, obtener el historial de conversacion y los mensajes entrantes nuevos.

    async startDM(address) {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        const xmtp = await Client.create(provider.getSigner())
        // It is very important that the Address is correctly written with ChecksumAddress, otherwise XMTP will not work.
        this.conversation = await xmtp.conversations.newConversation(this.web3.utils.toChecksumAddress(address))
        const messages = await this.conversation.messages()
        let tempMessages = []
        messages.forEach((item, index) => {
            try {

                tempMessages.push(JSON.parse(item.content))
            }
            catch {
                //
            }
        })
        this.setState({
            historyDM: tempMessages
        })
        // Listen for new messages in the this.conversation
        const account = this.web3.utils.toChecksumAddress(address)
        for await (const message of await this.conversation.streamMessages()) {
            if (account !== this.web3.utils.toChecksumAddress(address)) {
                console.log("Break:" + account)
                break
            }
            let historyDM = this.state.historyDM
            if (historyDM[historyDM.length - 1].message !== JSON.parse(message.content).message) {
                historyDM.push({
                    address: message.senderAddress,
                    message: JSON.parse(message.content).message
                })
                this.setState({
                    historyDM
                })
            }
        }
    }

Por ultimo para mandar mensajes nuevos a la otra addres ocuparemos la siguiente linea de codigo.

    async sendMessageXMTP() {
        let tempMes = this.state.message
        this.socketPub.send(JSON.stringify({
            address: this.context.value.address,
            to: this.state.to,
            message: tempMes,
            dm: true
        }))
        this.conversation.send(JSON.stringify({
            address: this.context.value.address,
            message: tempMes
        }))
        this.setState({
            message: "",
        })
    }

## Livepeer:

All the streaming services was done through Livepeer.

<img src="https://i.ibb.co/xCvBMz7/Livepeer-drawio.png">

To manage Streamers, the profiles of each of the Streamers were created within the Livepeer dashboard, with which we were able to provide each Streamer with their keys to perform their Streams.

<img src="https://i.ibb.co/J72qtkv/screen6.png">

Thanks to the Livepeer APIs it was possible for us to obtain if the Streamers were doing a Live, thanks to this the viewers could always be aware when a live stream is made.

<img src="https://i.ibb.co/8crFxr5/screen2.png">

La seccion de codigo que nos permite obtener los perfiles, grabaciones y estados (live u offline) es la siguiente.

Code: https://github.com/altaga/ChariTV/blob/main/WebPage/src/pages/main.js

    var myHeaders = new Headers();
        myHeaders.append("authorization", process.env.REACT_APP_Livepeer);
        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch("https://livepeer.com/api/stream?streamsonly=1", requestOptions)
            .then(response => response.text())
            .then(async (result) => {
                let temp = JSON.parse(result)
                let streamers = JSON.parse(result)
                myHeaders = new Headers();
                myHeaders.append("Authorization", process.env.REACT_APP_Livepeer);
                await Promise.all(temp.map(async (element, index) => {
                    await fetch(`https://livepeer.com/api/stream/${element.id}/sessions?record=1`, requestOptions)
                        .then(response => response.text())
                        .then(result => {
                            streamers[index]["records"] = JSON.parse(result)[0]
                            streamers[index]["recordsave"] = JSON.parse(result)[1]
                            streamers[index]["data"] = getUserData(element.id)
                            return (0)
                        })
                        .catch(error => console.log('error', error));
                }))
                this.setState({
                    streamers
                })
            })
            .catch(error => console.log('error', error));
 
# References

https://www.twitch.tv/creatorcamp/en/connect-and-engage/charity-streaming/

https://www.donordrive.com/charity-streaming/

https://www.youtube.com/watch?v=Hh4T4RuK1H8
