// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

contract CoinFlip is VRFConsumerBaseV2 {
    /** Errors */
    error CoinFlip__OnlyOwner();
    error CoinFlip__IncorrectEntryFee();
    error CoinFlip__InsufficientValue();

    /** Constants */
    uint16 private constant REQUEST_CONFIRMATIONS = 3; // number of block confirmations
    uint32 private constant NUM_WORDS = 1; // number of random values requested

    /** Immutables */
    uint256 private immutable i_entryFee = 1e17; // 0.1 ether
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;

    /** storage variables */
    address payable private s_owner;

    struct FlipRequest {
        address player;
        bool requestFulfilled;
        uint256 requestId;
        uint256 randomWord;
        bool didWin;
    }

    // Maps VRF requestId to a FlipRequest
    mapping(uint256 => FlipRequest) private s_flipRequests;

    event CoinFlip__FlipRequested(uint256 indexed requestId);

    event CoinFlip__FlipResult(
        uint256 indexed requestId,
        address indexed player,
        bool didWin
    );

    constructor(
        uint256 entryFee,
        address vrfCoordinator,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinator) {
        s_owner = payable(msg.sender);
        i_entryFee = entryFee;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    function flip() public payable returns (uint256 requestId) {
        if (msg.value != i_entryFee) {
            revert CoinFlip__IncorrectEntryFee();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_flipRequests[requestId] = FlipRequest({
            player: msg.sender,
            requestFulfilled: false,
            requestId: requestId,
            randomWord: 0,
            didWin: false
        });

        emit CoinFlip__FlipRequested(requestId);
    }

    function fulfillRandomWords(
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {
        s_flipRequests[requestId].requestFulfilled = true;
        s_flipRequests[requestId].randomWord = randomWords[0];
        uint256 coinFlip = randomWords[0] % 2;
        if (coinFlip == 0) {
            s_flipRequests[requestId].didWin = true;
            (bool success, ) = payable(s_flipRequests[requestId].player).call{
                value: i_entryFee * 2
            }("");
            require(success, "CoinFlip__TransferFailed");
            emit CoinFlip__FlipResult({
                requestId: requestId,
                player: msg.sender,
                didWin: true
            });
        } else {
            emit CoinFlip__FlipResult({
                requestId: requestId,
                player: msg.sender,
                didWin: false
            });
        }
    }

    function deposit() public payable {
        if (msg.sender != s_owner) {
            revert CoinFlip__OnlyOwner();
        }
        if (msg.value == 0) {
            revert CoinFlip__InsufficientValue();
        }
    }

    function withdraw() public {
        if (msg.sender != s_owner) {
            revert CoinFlip__OnlyOwner();
        }
        (bool success, ) = payable(s_owner).call{value: address(this).balance}(
            ""
        );
        require(success, "CoinFlip__TransferFailed");
    }

    function getOwner() public view returns (address) {
        return s_owner;
    }

    function getEntryFee() public pure returns (uint256) {
        return i_entryFee;
    }

    function getFlipRequest(
        uint256 requestId
    ) public view returns (FlipRequest memory) {
        return s_flipRequests[requestId];
    }
}
