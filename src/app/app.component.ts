import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EthersContractService, EthersProviderService, EthersSignerService } from '@core/services';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Contract } from 'ethers';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import TodoList from '../../build/contracts/TodoList.json';

interface ITask {
  content: string;
  completed: boolean;
}

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public tasks$: Observable<ITask[]>;

  public readonly newTask = new FormControl('');

  private todoListContractWithSigner?: Contract;

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.todoListContractWithSigner!.addTask(task);
    }
  }

  /**
   * TODO: Refactor
   */
  private setup(): void {
    this.ethersSignerService.currentAccount$
      .pipe(
        filter(currentAccount => !!currentAccount),
        untilDestroyed(this)
      )
      .subscribe(async () => {
        this.todoListContractWithSigner = this.ethersSignerService.connectContractWithSigner(
          this.ethersContractService.createContract(
            /* eslint-disable @typescript-eslint/no-unsafe-member-access */
            TodoList.networks[5777].address,
            TodoList.abi
            /* eslint-enable @typescript-eslint/no-unsafe-member-access */
          )
        );

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        const tasks = (await this.todoListContractWithSigner.getTasks()) as (Array<unknown> & ITask)[];

        this._tasks$.next(this.mapTasks(tasks));
      });
  }

  private mapTasks(tasks: (Array<unknown> & ITask)[]): ITask[] {
    return tasks.map(({ content, completed }) => ({ content, completed }));
  }
}
