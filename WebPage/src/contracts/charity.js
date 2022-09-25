exports.content = () => {
    return `
// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract ChariTV {

    address owner;
    address public charity;
    uint public counter = 0;

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    struct Donor
    { 
        address donor;
        uint amount;
    }

    mapping(uint => Donor[]) public Donors; 

    constructor(address _charity) {
        owner = msg.sender; 
        charity = _charity;
    }

    function addDonor() public payable{
        Donors[counter].push( Donor( msg.sender, msg.value ) );
        counter += 1;
    }

    function transferMoney() public isOwner{
        payable(charity).transfer(address(this).balance);
    }

}
`}

exports.abi = () => {
    return [
        {
            "inputs": [],
            "name": "addDonor",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "transferMoney",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_charity",
                    "type": "address"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [],
            "name": "charity",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "counter",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "Donors",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "donor",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "amount",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        }
    ]
};