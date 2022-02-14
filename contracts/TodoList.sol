// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract TodoList {
  struct Task {
    string content;
    bool completed;
  }

  mapping(address => Task[]) public tasks;

  function addTask(string memory _content) public {
    tasks[msg.sender].push(Task(_content, false));
  }

  function getTasks() public view returns(Task[] memory){
    return tasks[msg.sender];
  }
}
