import { Component, ViewChild } from '@angular/core';
import { MatSelectionList, MatSelectionListChange } from '@angular/material/list';
import { EthersProviderService, EthersSignerService } from '@core/services';
import { ITaskView, ITodoListContract, TodoListContractService } from '@core/services/todo-list-contract';
import { FormControl } from '@ngneat/reactive-forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild(MatSelectionList) public selectionList!: MatSelectionList;

  public tasks$: Observable<ITaskView[]>;

  public readonly newTask = new FormControl<string>('');

  private todoListContractWithSigner?: ITodoListContract;

  private readonly _tasks$ = new BehaviorSubject<ITaskView[]>([]);

  constructor(
    public readonly ethersProviderService: EthersProviderService,
    public readonly ethersSignerService: EthersSignerService,
    private readonly todoListContractService: TodoListContractService
  ) {
    this.tasks$ = this._tasks$.asObservable();

    ethersProviderService.init();

    this.setup();
  }

  public onConnect(): void {
    this.ethersProviderService.requestAccounts();
  }

  public async onAddTask(): Promise<void> {
    const task = this.newTask.value.trim();

    if (task.length > 0) {
      try {
        await this.todoListContractService.addTask(this.todoListContractWithSigner!, task);

        this.newTask.reset('');

        this.updateTasks();
      } catch {}
    }
  }

  public async onSelectionChange({ option }: MatSelectionListChange): Promise<void> {
    this.selectionList.setDisabledState(true);

    const task = option.value as ITaskView;

    try {
      await this.todoListContractService.toggleTaskCompletion(this.todoListContractWithSigner!, task.id);

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
        this.todoListContractWithSigner = this.ethersSignerService.connectWithContract(
          this.todoListContractService.create()
        );

        this.updateTasks();
      });
  }

  private async updateTasks(): Promise<void> {
    const tasks = await this.todoListContractService.getTasks(this.todoListContractWithSigner!);

    this._tasks$.next(tasks);
  }
}
