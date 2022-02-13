import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Nullable } from '@core/models';
import { Address } from '@core/models/web3';

@Component({
  selector: 'app-metamask-account',
  templateUrl: './metamask-account.component.html',
  styleUrls: ['./metamask-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetamaskAccountComponent {
  @Input() public isMetamaskInstalled!: Nullable<boolean>;
  @Input() public currentAccount!: Nullable<Address>;

  @Output() public readonly connect = new EventEmitter<void>();

  public onClick(): void {
    if (!this.currentAccount) {
      this.connect.emit();
    }
  }
}
