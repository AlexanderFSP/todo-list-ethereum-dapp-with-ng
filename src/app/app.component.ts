import { Component } from '@angular/core';
import { EthersProviderService, EthersSignerService } from '@core/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    public readonly ethersProviderService: EthersProviderService,
    public readonly ethersSignerService: EthersSignerService
  ) {
    ethersProviderService.init();
  }

  public onConnect(): void {
    this.ethersProviderService.requestAccounts();
  }
}
