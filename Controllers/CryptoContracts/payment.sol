// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.26;

// This will only compile via IR
contract Coin {

    address public minter=msg.sender;
    mapping(address => uint) public balances;

    


    function mint(address sender,address receiver, uint amount) public {
        require(sender == minter);
        balances[receiver] += amount;
    }

    event Sent(address sender, address reciever, uint amount);
    function send(address sender,address receiver, uint amount) public {
        require(amount <= balances[sender]);
        balances[sender] -= amount;
        balances[receiver] += amount;
        emit Sent(sender, receiver, amount);
       
    }
}