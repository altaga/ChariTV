import React, { Component } from 'react';
import autoBind from 'react-autobind';
import Web3 from 'web3';
import { abi } from '../contracts/charity';
import ContextModule from '../utils/contextModule';

function sortByKey(array, key) {
    const temp = array
    return temp.sort( (a, b) =>{
        var x = parseFloat(a[key]);
        var y = parseFloat(b[key]);
        return ((x > y) ? -1 : ((x < y) ? 1 : 0));
    });
}

async function fetchAsyncBalance(url) {
    return new Promise((resolve, reject) => {
        fetch(url, { method: 'GET', redirect: 'follow' })
            .then(result => result.text())
            .then((response) => {
                let temp = JSON.parse(response)
                for (let i = 0; i < temp.data.items.length; i++) {
                    if (temp.data.items[i].contract_ticker_symbol === "MATIC") {
                        resolve(temp.data.items[i].balance)
                    }
                }
                resolve(0)
            })
            .catch((error) => {
                console.log(error);
            })
    })
}

class Summary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            amount: "0",
            charity: "",
            donors: [],
            donnors:[]
        }
        autoBind(this);
        this.web3 = new Web3(`https://polygon-mainnet.g.alchemy.com/v2/${process.env.REACT_APP_Alchemy}`)
        this.contract = null
        this.counter = 0
        //this.messagesEndRef = React.createRef()
    }

    static contextType = ContextModule;

    async contractData() {
        this.contract = new this.web3.eth.Contract(abi(), this.context.value.contractAddress)
        let temp = await this.contract.methods.counter().call()
        let charity = await this.contract.methods.charity().call()
        this.setState({
            charity
        })
        if (parseInt(this.counter) < parseInt(temp)) {
            this.counter = temp
            let donors = new Array(parseInt(this.counter)).fill(null)
            donors = await Promise.all(
                donors.map(async (item, index) => {
                    let ret = await this.contract.methods.Donors(index, 0).call()
                    ret = {
                        amount: ret.amount,
                        address: ret.donor
                    }
                    return ret
                })
            )
            this.setState({
                donors:donors,
                donnors:donors[0]
            })
        }
    }

    async componentDidMount() {
        this.contractData()
        let amount = await fetchAsyncBalance(`https://api.covalenthq.com/v1/137/address/${this.context.value.contractAddress}/balances_v2/?key=${process.env.REACT_APP_Covalent}`)
        this.setState({
            amount
        })
        this.balanceCheck = setInterval(async () => {
            this.contractData()
            amount = await fetchAsyncBalance(`https://api.covalenthq.com/v1/137/address/${this.context.value.contractAddress}/balances_v2/?key=${process.env.REACT_APP_Covalent}`)
            this.setState({
                amount
            })
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.balanceCheck)
    }

    render() {
        return (
            <div style={{ position: "absolute", top: "6%", left: "0px", height: "94%", width: "20%", backgroundColor: "#18181b", display: "flex", flexDirection: "column", justifyContent: "space-evenly", alignItems: "center", borderRight: "1px solid", borderTop: "1px solid" }}>
                <div style={{ fontSize: 18, textAlign: "center" }}>
                    <span style={{ color: "white" }}>
                        <span style={{ fontWeight: "bold", fontSize:30 }}>
                            {
                                this.web3.utils.fromWei(this.state.amount, "ether")
                            }
                            {" "}MATIC
                        </span>
                        <br />
                        Raised
                        <br />
                    </span>
                    <br />
                    <div style={{ borderBottom: "1px solid", width: window.innerWidth * 0.2 }} />
                    <br />
                    <span style={{ cursor: "pointer", color: "white" }} onClick={() => window.open(`https://polygonscan.com/address/${this.state.charity}`, "_blank")}>
                        Charity: {"\n"}
                        {this.state.charity.substring(0, 4)}
                        ...
                        {this.state.charity.substring(this.state.charity.length - 4, this.state.charity.length)}
                    </span>
                    <br />
                    <span style={{ cursor: "pointer", color: "white" }} onClick={() => window.open(`https://polygonscan.com/address/${this.context.value.contractAddress}`, "_blank")}>
                        Contract: {"\n"}
                        {this.context.value.contractAddress.substring(0, 4)}
                        ...
                        {this.context.value.contractAddress.substring(this.context.value.contractAddress.length - 4, this.context.value.contractAddress.length)}
                    </span>
                </div>
                <div style={{ borderBottom: "1px solid", width: window.innerWidth * 0.2 }} />
                {
                    this.state.donors.length > 0 &&
                    <>
                        <div style={{ color: "white", fontSize: 24, textAlign: "center", margin: 10 }}>
                            <span style={{ fontWeight: "bold" }}>
                                Last Donation:
                            </span>
                            <br />
                            <span style={{ wordBreak: "break-word", fontSize: 18 }}>
                                {

                                    <span style={{ cursor: "pointer", color: "green" }} onClick={() => window.open(`https://polygonscan.com/address/${this.state.donnors.address}`, "_blank")}>
                                        {this.state.donnors.address.substring(0, 4)}
                                        ...
                                        {this.state.donnors.address.substring(this.state.donnors.address.length - 4, this.state.donnors.address.length)}
                                    </span>
                                }
                                {" "}:{" "}
                                {
                                    this.web3.utils.fromWei(this.state.donnors.amount, "ether")
                                }
                                MATIC
                            </span>
                        </div>
                        <div style={{ borderBottom: "1px solid", width: window.innerWidth * 0.2 }} />
                        <div style={{ color: "white", fontSize: 24, textAlign: "center", margin: 10 }}>
                            <span style={{ fontWeight: "bold" }}>
                                Top 5 Donors:
                            </span>
                            <br />
                            {
                                sortByKey(this.state.donors, "amount").slice(0, 5).map((item, index) =>
                                    <div key={"donor" + index}>
                                        <span style={{ wordBreak: "break-word", fontSize: 18 }}>
                                            {
                                                <span style={{ cursor: "pointer", color: index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "#cd7f32" : "green" }} onClick={() => window.open(`https://polygonscan.com/address/${item.address}`, "_blank")}>
                                                    {item.address.substring(0, 4)}
                                                    ...
                                                    {item.address.substring(item.address.length - 4, item.address.length)}
                                                </span>
                                            }
                                            {" "}:{" "}
                                            {
                                                this.web3.utils.fromWei(item.amount, "ether")
                                            }
                                            MATIC
                                        </span>
                                        <br />
                                    </div>
                                )
                            }
                        </div>
                    </>
                }
            </div >
        );
    }
}

export default Summary;