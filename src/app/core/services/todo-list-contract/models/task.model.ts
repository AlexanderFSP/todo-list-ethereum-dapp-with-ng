import { ethers } from 'ethers';

export interface IContractTask {
  id: ethers.BigNumber;
  content: string;
  completed: boolean;
}

export interface ITaskView extends Omit<IContractTask, 'id'> {
  id: number;
}
