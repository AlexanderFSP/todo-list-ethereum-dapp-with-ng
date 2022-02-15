import { Component, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { EthersContractService, EthersProviderService, EthersSignerService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ethers } from 'ethers';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import TodoList from '../../build/contracts/TodoList.json';

interface IEthersTask {
  id: ethers.BigNumber;
  content: string;
  completed: boolean;
}

interface ITask extends Omit<IEthersTask, 'id'> {
  id: number;
}

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatSelectionList) public selectionList!: MatSelectionList;

  public tasks$: Observable<ITask[]>;

  public readonly newTask = new FormControl('');

  private todoListContractWithSigner?: ethers.Contract;

  private readonly _tasks$ = new BehaviorSubject<ITask[]>([]);

  constructor(
    public readonly ethersProviderService: EthersProviderService,
    public readonly ethersSignerService: EthersSignerService,
    private readonly ethersContractService: EthersContractService
  ) {
    this.tasks$ = this._tasks$.asObservable();

    ethersProviderService.init();

    this.setup();
  }

  public onConnect(): void {
    this.ethersProviderService.requestAccounts();
  }

  public async onAddTask(): Promise<void> {
    const task = (this.newTask.value as string).trim();

    if (task.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const tx = (await this.todoListContractWithSigner!.addTask(task)) as ethers.ContractTransaction;

      // Waiting 1 confirm
      await tx.wait(1);

      this.newTask.reset('');

      this.updateTasks();
    }
  }

  public async onSelectionChange({ option }: MatSelectionListChange): Promise<void> {
    this.selectionList.setDisabledState(true);

    const task = option.value as ITask;

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const tx = (await this.todoListContractWithSigner!.toggleTaskCompletion(task.id)) as ethers.ContractTransaction;

      // Waiting 1 confirm
      await tx.wait(1);

      this.updateTasks();
    } catch {
      // Revert selection
      option.toggle();
    } finally {
      this.selectionList.setDisabledState(false);
    }
  }

  private setup(): void {
    this.ethersSignerService.currentAccount$
      .pipe(
        filter(currentAccount => !!currentAccount),
        untilDestroyed(this)
      )
      .subscribe(() => {
        this.todoListContractWithSigner = this.ethersSignerService.connectContractWithSigner(
          this.ethersContractService.createContract(
            /* eslint-disable @typescript-eslint/no-unsafe-member-access */
            TodoList.networks[5777].address,
            TodoList.abi
            /* eslint-enable @typescript-eslint/no-unsafe-member-access */
          )
        );

        this.updateTasks();
      });
  }

  private async updateTasks(): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const tasks = (await this.todoListContractWithSigner!.getTasks()) as (Array<unknown> & IEthersTask)[];

    this._tasks$.next(this.mapTasks(tasks));
  }

  private mapTasks(tasks: (Array<unknown> & IEthersTask)[]): ITask[] {
    return tasks.map(({ id, content, completed }) => ({
      id: id.toNumber(),
      content,
      completed
    }));
  }
}
