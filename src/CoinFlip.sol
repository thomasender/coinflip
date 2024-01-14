// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

contract CoinFlip {
    /** Errors */
    error CoinFlip__OnlyOwner();
    error CoinFlip__InsufficientValue();

    /** storage variables */
    address payable private owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function deposit() public payable {
        if (msg.sender != owner) {
            revert CoinFlip__OnlyOwner();
        }
        if (msg.value == 0) {
            revert CoinFlip__InsufficientValue();
        }
    }

    function withdraw() public {
        if (msg.sender != owner) {
            revert CoinFlip__OnlyOwner();
        }
        (bool success, ) = payable(owner).call{value: address(this).balance}(
            ""
        );
        require(success, "Transfer failed!!!");
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
