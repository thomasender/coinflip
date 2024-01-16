// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import {CoinFlip} from "../src/CoinFlip.sol";
import {Test, console} from "forge-std/Test.sol";
import {DeployCoinFlip} from "../script/DeployCoinFlip.s.sol";
import {HelperConfig} from "../script/HelperConfig.s.sol";
import {VRFCoordinatorV2Mock} from "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol";
import {Vm} from "forge-std/Vm.sol";

contract CoinFlipTest is Test {
    /** Events */
    event CoinFlip__FlipRequested(uint256 indexed requestId);
    event CoinFlip__FlipResult(
        uint256 indexed requestId,
        address indexed player,
        bool didWin
    );

    CoinFlip coinFlip;
    HelperConfig helperConfig;
    uint256 entranceFee;
    address vrfCoordinator;
    bytes32 gasLane;
    uint64 subscriptionId;
    uint32 callbackGasLimit;
    address linkTokenAddress;

    // creates a new address from a string
    address public OWNER = makeAddr("owner");
    address public PLAYER = makeAddr("player");
    uint256 public constant STARTING_USER_BALANCE = 10e18;
    uint256 public constant ONE_ETHER = 1e18; // 1 ether
    uint256[] public CUSTOM_RANDOM_WORDS_WIN = [2];
    uint256[] public CUSTOM_RANDOM_WORDS_LOOSE = [3];

    function setUp() external {
        DeployCoinFlip deployCoinFlip = new DeployCoinFlip();
        (coinFlip, helperConfig) = deployCoinFlip.run();
        (
            entranceFee,
            vrfCoordinator,
            gasLane,
            subscriptionId,
            callbackGasLimit,
            linkTokenAddress,

        ) = helperConfig.activeNetworkConfig();
        vm.deal(OWNER, STARTING_USER_BALANCE);
        vm.deal(PLAYER, STARTING_USER_BALANCE);
    }

    function testDeposit() public {
        uint256 balanceBeforeDeposit = address(coinFlip).balance;
        vm.prank(OWNER);
        coinFlip.deposit{value: ONE_ETHER}();
        uint256 balanceAfterDeposit = address(coinFlip).balance;
        assert(balanceAfterDeposit == balanceBeforeDeposit + ONE_ETHER);
    }

    function testDepositRevertsIfSentWithoutValue() public {
        vm.expectRevert(CoinFlip.CoinFlip__InsufficientValue.selector);
        vm.prank(OWNER);
        coinFlip.deposit{value: 0}();
    }

    function testDepositRevertsIfNotCalledByOnwer() public {
        vm.expectRevert(CoinFlip.CoinFlip__OnlyOwner.selector);
        vm.prank(PLAYER);
        coinFlip.deposit{value: 1e18}();
    }

    function testGetOwner() public view {
        assert(coinFlip.getOwner() == address(OWNER));
    }

    function testWidthdraw() public {
        uint256 ownerBalanceBeforeDeposit = address(OWNER).balance;
        vm.prank(OWNER);
        coinFlip.deposit{value: ONE_ETHER}();
        uint256 ownerBalanceBeforeWithdraw = address(OWNER).balance;
        assert(ownerBalanceBeforeWithdraw < ownerBalanceBeforeDeposit);
        assert(
            ownerBalanceBeforeDeposit - ONE_ETHER == ownerBalanceBeforeWithdraw
        );
        vm.prank(OWNER);
        coinFlip.withdraw();
        uint256 ownerBalanceAfterWithdraw = address(OWNER).balance;
        assert(ownerBalanceAfterWithdraw == ownerBalanceBeforeDeposit);
    }

    function testWidthdrawRevertsIfNotCalledByOwner() public {
        vm.prank(OWNER);
        coinFlip.deposit{value: ONE_ETHER}();
        vm.expectRevert(CoinFlip.CoinFlip__OnlyOwner.selector);
        vm.prank(PLAYER);
        coinFlip.withdraw();
    }

    function testGetEntryFee() public view {
        assert(coinFlip.getEntryFee() == 1e16);
    }

    function testFlipRevertsIfEntryFeeIsNotCorrect() public {
        vm.prank(PLAYER);
        vm.expectRevert(CoinFlip.CoinFlip__IncorrectEntryFee.selector);
        coinFlip.flip{value: 0}();
    }

    function testFlipStoresFlipRequestInRequestIdToFlipRequestMapping() public {
        vm.prank(PLAYER);
        coinFlip.flip{value: 1e16}();
        CoinFlip.FlipRequest memory flipRequest = coinFlip.getFlipRequest(1);
        assert(flipRequest.player == PLAYER);
        assert(flipRequest.didWin == false);
    }

    function testFlipEmitsFlipRequestEvent() public {
        vm.prank(PLAYER);
        vm.expectEmit(true, false, false, false, address(coinFlip));
        emit CoinFlip__FlipRequested(1);

        coinFlip.flip{value: 1e16}();
    }

    ///////////////////////////////////////
    ////////// fulfillRandomWords /////////
    /////////////////////////////////////

    modifier skipTestingOnFork() {
        if (block.chainid != 31337) {
            return;
        }
        _;
    }

    function testFulfillRandomWordsCanOnlyBeCalledWithExistingRequestId()
        public
        skipTestingOnFork
    {
        // Arrange
        vm.prank(PLAYER);
        coinFlip.flip{value: 1e16}();
        /// @dev see VRFCoordinatorV2Mock for the revert reason
        vm.expectRevert("nonexistent request");
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            2,
            address(coinFlip)
        );
    }

    modifier contractFunded() {
        vm.prank(OWNER);
        coinFlip.deposit{value: ONE_ETHER}();
        _;
    }

    function testFulfillRandomWordsUpdatesFlipRequestWithRandomWord()
        public
        skipTestingOnFork
        contractFunded
    {
        // Arrange
        vm.prank(PLAYER);
        coinFlip.flip{value: 1e16}();
        // Act
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            1,
            address(coinFlip)
        );
        // Assert
        CoinFlip.FlipRequest memory flipRequest = coinFlip.getFlipRequest(1);
        assert(flipRequest.randomWord != 0);
        assert(
            flipRequest.randomWord ==
                78541660797044910968829902406342334108369226379826116161446442989268089806461
        );
    }

    function testFulfillRandomWordsForLooser()
        public
        skipTestingOnFork
        contractFunded
    {
        uint256 playerBalanceBeforeFlip = address(PLAYER).balance;
        uint256 contractBalanceBeforeFlip = address(coinFlip).balance;
        // Arrange
        vm.prank(PLAYER);
        coinFlip.flip{value: 1e16}();
        // Act
        vm.expectEmit(true, false, false, false, address(coinFlip));
        vm.recordLogs(); // Starts recording the logs
        emit CoinFlip__FlipResult(1, PLAYER, true);
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWordsWithOverride(
            1,
            address(coinFlip),
            CUSTOM_RANDOM_WORDS_LOOSE
        );
        uint256 playerBalanceAfterFlip = address(PLAYER).balance;
        uint256 contractBalanceAfterFlip = address(coinFlip).balance;
        Vm.Log[] memory logs = vm.getRecordedLogs();
        bytes32 requestId = logs[0].topics[1];
        bytes32 player = logs[0].topics[2];
        assert(uint256(requestId) == 1);
        assert(address(uint160(uint256(player))) == PLAYER);
        assert(playerBalanceBeforeFlip > playerBalanceAfterFlip);
        assert(contractBalanceBeforeFlip < contractBalanceAfterFlip);
        assert(
            playerBalanceBeforeFlip - coinFlip.getEntryFee() ==
                playerBalanceAfterFlip
        );
        assert(
            contractBalanceBeforeFlip + coinFlip.getEntryFee() ==
                contractBalanceAfterFlip
        );
    }

    function testFulfillRandomWordsForWinner()
        public
        skipTestingOnFork
        contractFunded
    {
        // Arrange
        uint256 playerBalanceBeforeFlip = address(PLAYER).balance;
        uint256 contractBalanceBeforeFlip = address(coinFlip).balance;
        vm.prank(PLAYER);
        coinFlip.flip{value: 1e16}();
        // Act
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWordsWithOverride(
            1,
            address(coinFlip),
            CUSTOM_RANDOM_WORDS_WIN
        );
        uint256 playerBalanceAfterFlip = address(PLAYER).balance;
        uint256 contractBalanceAfterFlip = address(coinFlip).balance;
        CoinFlip.FlipRequest memory flipRequest1 = coinFlip.getFlipRequest(1);
        // Assert
        assert(playerBalanceBeforeFlip < playerBalanceAfterFlip);
        assert(contractBalanceBeforeFlip > contractBalanceAfterFlip);
        assert(
            playerBalanceBeforeFlip + coinFlip.getEntryFee() ==
                playerBalanceAfterFlip
        );
        assert(
            contractBalanceBeforeFlip - coinFlip.getEntryFee() ==
                contractBalanceAfterFlip
        );
        assert(flipRequest1.didWin == true);
        assert(flipRequest1.randomWord != 0);
        assert(flipRequest1.randomWord == 2);
    }
}
