import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

import TodoList from '../../../../../build/contracts/TodoList.json';
import { EthersContractService } from '../ethers-contract.service';
import { IContractTask, ITaskView } from './models';

export interface ITodoListContract extends ethers.Contract {
  toggleTaskCompletion: ethers.ContractFunction;
  addTask: ethers.ContractFunction;
  getTasks: ethers.ContractFunction<IContractTask[]>;
}

@Injectable({
  providedIn: 'root'
})
export class TodoListContractService {
  constructor(private readonly ethersContractService: EthersContractService) {}

  public create(signerOrProvider?: ethers.Signer | ethers.providers.Provider): ITodoListContract {
    return this.ethersContractService.createContract(
      TodoList.networks[5777].address,
      TodoList.abi,
      signerOrProvider
    ) as ITodoListContract;
  }

  public async toggleTaskCompletion(contract: ITodoListContract, id: number): Promise<ethers.ContractReceipt> {
    const tx = (await contract.toggleTaskCompletion(id)) as ethers.ContractTransaction;

    // Waiting 1 confirm
    return tx.wait(1);
  }

  public async addTask(contract: ITodoListContract, task: string): Promise<ethers.ContractReceipt> {
    const tx = (await contract.addTask(task)) as ethers.ContractTransaction;

    // Waiting 1 confirm
    return tx.wait(1);
  }

  public async getTasks(contract: ITodoListContract): Promise<ITaskView[]> {
    const tasks = await contract.getTasks();
    const taskViews: ITaskView[] = tasks.map(({ id, content, completed }) => ({
      id: id.toNumber(),
      content,
      completed
    }));

    return Promise.resolve(taskViews);
  }
}
