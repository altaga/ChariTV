import React, { Component } from 'react';
import autoBind from 'react-autobind';
import VP from '../components/videoplayer';
import usersData from '../utils/usersData';
import Chat from '../components/chat';
import Header from '../components/headerChat';
import { withHooksHOC } from "../utils/params"
import foot from "../assets/foot.png"
import Summary from '../components/summary';

const requestOptions = {
    method: 'GET',
    redirect: 'follow'
};

function getUserData(publicKey) {
    for (let i = 0; i < usersData.length; i++) {
        if (usersData[i].publicKey === publicKey) {
            return usersData[i];
        }
    }
}

async function checkLive(streamURL) {
    let response = await fetch(streamURL, requestOptions);
    return response.status === 200 ? true : false;
}

class Streamer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            records: [],
            live: "",
            amount: "",
            donors: [],
        }
        autoBind(this);
        this.data = getUserData(this.props.params.pub)
        this.balanceCheck = null
    }


    componentDidMount() {
        var myHeaders = new Headers();
        myHeaders.append("authorization", process.env.REACT_APP_Livepeer);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://livepeer.com/api/stream/${this.data.streamID}/sessions?record=1`, requestOptions)
            .then(response => response.text())
            .then(async (result) => {
                let live = await checkLive(this.data.streamURL)
                this.setState({
                    live,
                    records: JSON.parse(result)
                })
            })
            .catch(error => console.log('error', error));
    }

    componentWillUnmount() {
        clearInterval(this.balanceCheck)
    }

    render() {
        return (
            <>
                <Header />
                <Chat />
                <Summary />
                <div style={{ position: "absolute", top: "6%", right: "20%", left: "20%", width: "60%", height: "94%", backgroundColor: "#18181b", display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "center", overflowY: "scroll", overflowX: "hidden" }}>
                    {
                        this.state.live === true &&
                        <div style={{ height: "auto" }}>
                            <VP
                                src={this.data.streamURL}
                                poster={this.data.logo}
                                width={window.innerWidth * 0.6}
                                height={window.innerHeight * 0.6}
                            />
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginTop: "10px", marginBottom: "10px" }}>
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center", color: "white", fontSize: "20px" }}>
                                    <img alt='isdasg0001'
                                        src={this.data.logo}
                                        width="48px"
                                        height="48px"
                                        style={{
                                            borderRadius: "100px",
                                            border: "6px red solid"
                                        }}
                                    />
                                    Live
                                </div>
                                <span style={{ marginLeft: "10px", color: "white", paddingRight: window.innerWidth * 0.3 }}>
                                    {
                                        "3 watching now"
                                    }
                                    <br />
                                    {
                                        this.data.name + " " + this.data.title
                                    }
                                    <br />
                                    {
                                        this.data.charity
                                    }
                                </span>
                            </div>
                        </div>
                    }
                    {
                        (this.state.live === false && this.state.records.length > 0) &&
                        <div style={{ height: "auto" }}>
                            <VP
                                src={this.state.records[0].recordingUrl}
                                poster={this.data.logo}
                                width={window.innerWidth * 0.6}
                                height={window.innerHeight * 0.6}
                            />
                            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center", marginTop: "10px", marginBottom: "10px" }}>
                                <img alt='ig00sadc01'
                                    src={this.data.logo}
                                    width="64px"
                                    height="64px"
                                    style={{
                                        borderRadius: "100px",
                                        border: "6px black solid",
                                    }}
                                />
                                <span style={{ marginLeft: "10px", color: "white", paddingRight: window.innerWidth * 0.3 }}>
                                    {
                                        this.data.name + " - " + this.data.title
                                    }
                                    <br />
                                    {
                                        this.data.charity
                                    }
                                </span>
                            </div>
                        </div>
                    }
                    <div style={{ width: "100%", backgroundColor: "#0E0E10", display: "flex", flexDirection: "row", paddingTop: "10px" }}>
                        <div style={{ display: "flex", flexDirection: "column", paddingLeft: "100px", color: "white" }}>
                            <img alt='igafx0001'
                                src={foot}
                                width="100%"
                                height="auto"
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default withHooksHOC(Streamer);