NOTE: If you are going to make a test donation, remember to modify the amount of gas in Metamask to Low, Medium or High, otherwise the transaction will work.# ChariTV

<img src="https://i.ibb.co/x2GcDdk/logo.png" >

<p>

ChariTV Description

# Watch our demo video:

[![Demo](https://i.ibb.co/j3DCtPZ/image.png)](https://www.youtube.com/watch?v=igEGP1Jwgl0)

# Test the product:

## URL: https://main.d1su9u0306vtdi.amplifyapp.com

Use Polygon Mainnet on Metamask Wallet!!!!

- Get it on: https://metamask.io/

- Follow: https://academy.binance.com/en/articles/how-to-add-polygon-to-metamask

NOTE: If you are going to make a test donation, remember to modify the amount of gas in Metamask to Low, Medium or High, otherwise the transaction will work.

<img src="https://i.ibb.co/K7dYJP4/New-Project-2.png">

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
  - Obtaining the account's MATIC Balance.
  - Obtaining the account's NFT Balances.
  - We get the contracts from the NFTs.
- Streamr Network:
  - Websocket Service:
    - Publish:
      - Send messages to the general chat
    - Subscribe:
      - Receive general chat messages
      - Receive DM notifications.
    - Streamr Node:
      - https://streamr.network/network-explorer/nodes/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%23ca258d52-2abf-4dc2-b9cf-dfdeed921e121
    - Streamr streams:
      - https://streamr.network/network-explorer/streams/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%2FChariTV
- XMTP:
  - XMTP Client:
    - Sign in for authentication to the private conversation.
    - Send direct messages through a private chat.
    - Get message history with the same account.
- Livepeer:
  - RTMP URL:
    - Url to easily transmit from the OBS and start our transmission.
  - Livestreams and Recordings API:
    - Obtaining the url if a streamr is live.
    - Obtaining the last record of each streamer if he is offline.

# How it's built:

## Polygon Network:

<img src="https://i.ibb.co/m8fNPS9/Image.png" >

The Polygon network was used to deploy all the contracts, both the contracts of all the NFTs and the main donations contract, in this case it was designed for its speed and low fees, making it easily scalable to carry out an effective charity campaigns.

The donations contract allows us to generate a contract that gathers all the donated money itself, makes a record of each of the donors and finally transfers all the money collected to the public address of the campaign.

Code: https://github.com/altaga/ChariTV/blob/main/WebPage/src/contracts/charity.js

<img src="https://i.ibb.co/vVVHWpS/image.png">

In the case of NFTs, these are distributed after streaming, taking into account the donations made and the amount.

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
        // Get Only NFTs Tokens
        temp = temp.data.data.items.filter(item => item.type === "nft");
        // Get Only Contracts
        temp = temp.map(item => {
            return ({
                contractAddress: item.contract_address
            })
        })
        // Setup Contract and Get the data from Blockchain
        let provider = new ethers.providers.JsonRpcProvider(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_Alchemy}`);
        temp.forEach((item) => {
            if (item.contractAddress !== "") {
                contractsNFT.push(new ethers.Contract(item.contractAddress, abi2(), provider))
            }
        })
        // Get the Metadata for All the NFTs
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
        // Setup NFTs to state
        if (this.state.nfts.length !== res.length) {
            this.setState({
                nfts: res
            })
        }
    }

## Streamr Network:

<img src="https://i.ibb.co/Y3rx6r6/image.png" >

In order to make our Streamr Websocket in our live chat we had to first configure a Server in AWS as a Node in the Streamr Network, as you can see in the following URL that is our node.

https://streamr.network/network-explorer/nodes/0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5%23ca258d52-2abf-4dc2-b9cf-dfdeed921e121

Node Docs: https://streamr.network/docs/streamr-network/installing-broker-node

Once the node is configured and the corresponding ports are configured in our server we will obtain a WebSocket that we can consume in our app, however we will still have to create the Stream in https://streamr.network/core/streams/ otherwise when trying to publish in the websocket will not work.

<img src="https://i.ibb.co/wCGqYm7/image.png" >

Now one last challenge that we have to solve is how to consume the WebSocket in a production environment, since the WebSocket that we have created works without an SSL certificate, so we will have two options, install a certificate to the server or perform a tunnel from the server to a secure URL, taking advantage of the fact that the node can run via a docker container, it seemed more sensible to use a container orchestrator to manage both services on the server easily.

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

In short, the first service is the Streamr Network Broker Node, the service to perform the secure tunnel is Ngrok and both are connected to the same network within the orchestrator.

<img src="https://i.ibb.co/M6kc1ww/dockercompose-drawio.png" >

Within our app the code that receives and sends the messages to the chat is the following.

Code: https://github.com/altaga/ChariTV/blob/main/WebPage/src/components/chat.js

    connectSub() {
        this.socketSub = new WebSocket(`${process.env.REACT_APP_StreamrWSS}/streams/${encodeURIComponent("0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5/ChariTV")}/subscribe?apiKey=${process.env.REACT_APP_StreamrAPI}`)
        // Setup Flag on Connect
        this.socketSub.addEventListener('open', () => {
            this.setState({
                readySub: true
            })
        })
        this.socketSub.addEventListener('message', (message) => {
            // Recieve All NO DMs messages
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
            // Push notification for new DM message
            if (JSON.parse(message.data).dm && this.context.value.address !== "" && this.context.value.address === JSON.parse(message.data).to && !this.state.dm) {
                let temp = this.context.value.chatNotif
                temp.push(JSON.parse(message.data))
                this.context.setValue({
                    chatNotif:temp
                })
                this.audio.play()
            }
        })
        // Try to reconnect every 5 seconds
        this.socketSub.addEventListener('close', () => {
            this.setState({
                readySub: false
            }, () => setTimeout(() => {
                this.connectSub()
            }, 5000))
        })

    }

    connectPub() {
        // Setup Flag on Connect
        this.socketPub = new WebSocket(`${process.env.REACT_APP_StreamrWSS}/streams/${encodeURIComponent("0x905d45128f4ae35e2a5ea7b0210f8fa9a4f101d5/ChariTV")}/publish?apiKey=${process.env.REACT_APP_StreamrAPI}`)
        this.socketPub.addEventListener('open', () => {
            this.setState({
                readyPub: true
            })
        })
        // Try to reconnect every 5 seconds
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

Because our app requires a reliable service to carry out a private chat, it was decided to include the XMTP Client to carry out private messages between donors.

Code: https://github.com/altaga/ChariTV/blob/main/WebPage/src/components/chat.js

This service has 3 fundamental parts, sign in, get the conversation history and new incoming messages.

    async startDM(address) {
        // Setup Metamask as provider
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any")
        // Create new Client
        const xmtp = await Client.create(provider.getSigner())
        // It is very important that the Address is correctly written with ChecksumAddress, otherwise XMTP will not work.
        this.conversation = await xmtp.conversations.newConversation(this.web3.utils.toChecksumAddress(address))
        // Get all history
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
            // Break if dm account change
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

Finally, to send new messages to the other address, we will use the following line of code.

    // Send New message
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

The section of code that allows us to obtain the profiles, recordings and states (live or offline) is the following.

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
