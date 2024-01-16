// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import {Script} from "forge-std/Script.sol";
import {VRFCoordinatorV2Mock} from "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol";
import {LinkToken} from "../test/mocks/LinkToken.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        uint256 entranceFee;
        address vrfCoordinator;
        bytes32 gasLane;
        uint64 subscriptionId;
        uint32 callbackGasLimit;
        address linkTokenAddress;
        uint256 deployerKey;
    }

    NetworkConfig public activeNetworkConfig;

    uint256 public constant DEFAULT_ANVIL_PRIVATE_KEY =
        0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;

    constructor() {
        if (block.chainid == 11155111) {
            activeNetworkConfig = getSepoliaEthConfig();
        } else if (block.chainid == 137) {
            activeNetworkConfig = getPolygonMainnetConfig();
        } else if (block.chainid == 80001) {
            activeNetworkConfig = getMumbaiEthConfig();
        } else {
            activeNetworkConfig = getOrCreateAnvilEthConfig();
        }
    }

    function getSepoliaEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                entranceFee: 0.01 ether,
                vrfCoordinator: 0x8103B0A8A00be2DDC778e6e7eaa21791Cd364625,
                gasLane: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c,
                subscriptionId: 0,
                callbackGasLimit: 500000,
                linkTokenAddress: 0x779877A7B0D9E8603169DdbD7836e478b4624789,
                deployerKey: vm.envUint("PRIVATE_KEY")
            });
    }

    function getOrCreateAnvilEthConfig() public returns (NetworkConfig memory) {
        if (activeNetworkConfig.vrfCoordinator != address(0)) {
            // We are not on the local chain, so we can return the active config
            return activeNetworkConfig;
        }

        uint96 baseFee = 0.01 ether; // 0.1 LINK
        uint96 gasPriceLink = 1e9; // 1gwei LINK

        vm.startBroadcast();
        // Deploy a new VRFCoordinatorV2Mock
        VRFCoordinatorV2Mock vrfCoordinatorMock = new VRFCoordinatorV2Mock(
            baseFee,
            gasPriceLink
        );
        LinkToken linkToken = new LinkToken();
        vm.stopBroadcast();

        return
            NetworkConfig({
                entranceFee: 0.01 ether,
                vrfCoordinator: address(vrfCoordinatorMock),
                gasLane: 0x474e34a077df58807dbe9c96d3c009b23b3c6d0cce433e59bbf5b34f823bc56c,
                subscriptionId: 0, // will be added by script
                callbackGasLimit: 500000,
                linkTokenAddress: address(linkToken),
                deployerKey: DEFAULT_ANVIL_PRIVATE_KEY
            });
    }

    function getMumbaiEthConfig() public view returns (NetworkConfig memory) {
        return
            NetworkConfig({
                entranceFee: 0.01 ether,
                vrfCoordinator: 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed,
                gasLane: 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f,
                subscriptionId: 0,
                callbackGasLimit: 500000,
                linkTokenAddress: 0x326C977E6efc84E512bB9C30f76E30c160eD06FB,
                deployerKey: vm.envUint("PRIVATE_KEY")
            });
    }

    function getPolygonMainnetConfig()
        public
        view
        returns (NetworkConfig memory)
    {
        return
            NetworkConfig({
                entranceFee: 1 ether,
                vrfCoordinator: 0xAE975071Be8F8eE67addBC1A82488F1C24858067,
                gasLane: 0xcc294a196eeeb44da2888d17c0625cc88d70d9760a69d58d853ba6581a9ab0cd,
                subscriptionId: 0,
                callbackGasLimit: 500000,
                linkTokenAddress: 0xb0897686c545045aFc77CF20eC7A532E3120E0F1,
                deployerKey: vm.envUint("PRIVATE_KEY")
            });
    }
}
