// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import {CoinFlip} from "../src/CoinFlip.sol";
import {Test, console} from "forge-std/Test.sol";

contract CoinFlipTest is Test {
    CoinFlip coinFlip;

    // creates a new address from a string
    address public OWNER = makeAddr("owner");
    address public PLAYER = makeAddr("player");
    uint256 public constant STARTING_USER_BALANCE = 10e18;
    uint256 public constant ONE_ETHER = 1e18; // 1 ether

    function setUp() external {
        vm.prank(OWNER);
        coinFlip = new CoinFlip();
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
}
