// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract TodoList {
  uint lastTaskId = 0;

  struct Task {
    uint id;
    string content;
    bool completed;
  }

  mapping(address => Task[]) public tasks;

  function addTask(string memory _content) public {
    tasks[msg.sender].push(Task(++lastTaskId, _content, false));
  }

  function toggleTaskCompletion(uint _id) public {
    for (uint i = 0; i < tasks[msg.sender].length; i++) {
      if (tasks[msg.sender][i].id == _id) {
        tasks[msg.sender][i].completed = !tasks[msg.sender][i].completed;

        return;
      }
    }
  }

  function getTasks() public view returns(Task[] memory){
    return tasks[msg.sender];
  }
}
