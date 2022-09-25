import React, { Component } from 'react';
import usersData from '../utils/usersData';
import autoBind from 'react-autobind';
import Web3 from 'web3';
import ContextModule from '../utils/contextModule';
import VPhsl from './videoplayerhsl';

function getUserData(streamID) {
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].streamID === streamID) {
            return usersData[i];
        }
    }
}

class Streamers extends Component {
    constructor(props) {
        super(props);
        this.state = {
            streamers: []
        }
        autoBind(this);
        this.web3 = new Web3(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_Alchemy}`)
        this.contract = null
        this.counter = 0
        //this.messagesEndRef = React.createRef()
    }

    static contextType = ContextModule;

    async componentDidMount() {
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
    }

    componentWillUnmount() {

    }

    render() {
        return (
            <>
                <div style={{ position: "absolute", top: "6%", left: "0px", height: "94%", width: "20%", backgroundColor: "#18181b", display: "flex", flexDirection: "column", alignItems: "flex-start", borderRight: "1px solid", borderTop: "1px solid", overflow: 'hidden' }}>
                    {
                        this.state.streamers.length > 0 && this.state.streamers[0].data !== undefined && this.state.streamers.map((item, index) =>
                            <div key={"Streamer:" + index} style={{ borderBottom: "1px solid", width: "100%" }}>
                                <div onClick={() => window.open(`/streamer/${item.data.publicKey}`, "_blank")} style={{ display: "flex", flexDirection: "row", marginTop: "10px", marginBottom: "10px", cursor: "pointer" }}>
                                <img alt='ig00dsa01'
                                        src={item.data.logo}
                                        width="50px"
                                        height="50px"
                                        style={{
                                            borderRadius: "100px",
                                            border: `6px ${item.isActive ? "red" : "black"} solid`,
                                        }}
                                    />
                                    <span style={{ marginLeft: "10px", color: "white" }}>
                                        {
                                            item.data.name
                                        }
                                        <br />
                                        {
                                            item.data.charity
                                        }
                                    </span>
                                </div>
                            </div>
                        )
                    }
                </div >
                <div style={{ position: "absolute", top: "6%", right: "20%", left: "20%", width: "80%", height: "94%", backgroundColor: "#0E0E10", color: "white", fontWeight: "bold", fontSize: "1.1rem", padding: "10px", overflowY: 'scroll' }}>
                    Clips we think you’ll like
                    <br />
                    <br />
                    <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                        {
                            this.state.streamers.length > 0 && this.state.streamers.map((item, index) =>
                                <div onClick={() => window.open(`/streamer/${item.data.publicKey}`, "_blank")} key={"StreamerVideo:" + index} style={{ display: "flex", flexDirection: "column", cursor: "pointer" }}>
                                    <div style={{ margin: "0px 20px 0px" }}>
                                        {
                                            item.isActive ?
                                                <VPhsl
                                                    src={item.recordsave.recordingUrl}
                                                    poster={item.data.logo}
                                                    width={window.innerWidth * 0.2}
                                                    height={window.innerHeight * 0.2}
                                                />
                                                :
                                                <VPhsl
                                                    src={item.records.recordingUrl}
                                                    poster={item.data.logo}
                                                    width={window.innerWidth * 0.2}
                                                    height={window.innerHeight * 0.2}
                                                />
                                        }
                                    </div>
                                    <span style={{ color: "white", margin: "0px 20px 20px" }}>
                                        {
                                            item.data.name + " "
                                        }
                                        {
                                            item.isActive && <span style={{ color: "red"}}> LIVE</span>
                                        }
                                        <br />
                                        {
                                            item.data.charity
                                        }
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </div>

            </>
        );
    }
}

export default Streamers;