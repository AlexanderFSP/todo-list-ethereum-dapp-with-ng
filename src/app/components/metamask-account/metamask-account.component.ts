import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Address, Nullable } from '@core/models';

@Component({
  selector: 'app-metamask-account',
  templateUrl: './metamask-account.component.html',
  styleUrls: ['./metamask-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetamaskAccountComponent {
  @Input() public isMetamaskInstalled!: Nullable<boolean>;
  @Input() public currentAccount!: Nullable<Address>;
  @Input() public currentAccountBalance!: Nullable<string>;

  @Output() public readonly connect = new EventEmitter<void>();

  public onClick(): void {
    if (!this.currentAccount) {
      this.connect.emit();
    }
  }
}
