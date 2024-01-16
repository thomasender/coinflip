// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {Test} from "forge-std/Test.sol";
import {CoinFlip} from "../src/CoinFlip.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {CreateSubscription, FundSubscription, AddConsumer} from "./Interactions.s.sol";

contract DeployCoinFlip is Script, Test {
    // USE THIS FOR TESTING ONLY
    // address public OWNER = makeAddr("owner");

    function run() external returns (CoinFlip, HelperConfig) {
        HelperConfig helperConfig = new HelperConfig();
        (
            uint256 entranceFee,
            address vrfCoordinator,
            bytes32 gasLane,
            uint64 subscriptionId,
            uint32 callbackGasLimit,
            address linkToken,
            uint256 deployerKey
        ) = helperConfig.activeNetworkConfig();

        if (subscriptionId == 0) {
            // we need to create a subscription with Chainlink VRF!
            CreateSubscription createSubscription = new CreateSubscription();
            subscriptionId = createSubscription.createSubscription(
                vrfCoordinator,
                deployerKey
            );
        }

        // Fund the subscription
        FundSubscription fundSubscription = new FundSubscription();
        fundSubscription.fundSubscription(
            vrfCoordinator,
            subscriptionId,
            linkToken,
            deployerKey
        );
        // UNCOMMENT FOR TESTING ONLY
        // vm.startBroadcast(OWNER);
        // UNCOMMENT FOR DEPLOYMENT!
        vm.startBroadcast();
        CoinFlip coinFlip = new CoinFlip(
            entranceFee,
            vrfCoordinator,
            gasLane,
            subscriptionId,
            callbackGasLimit
        );
        vm.stopBroadcast();

        AddConsumer addConsumer = new AddConsumer();
        addConsumer.addConsumer(
            address(coinFlip),
            vrfCoordinator,
            subscriptionId,
            deployerKey
        );

        return (coinFlip, helperConfig);
    }
}
