import { Inject, Injectable } from '@angular/core';
import { Nullable } from '@core/models';
import detectEthereumProvider from '@metamask/detect-provider';
import { ethers } from 'ethers';
import { BehaviorSubject, Observable } from 'rxjs';
import { EthersSignerService } from './ethers-signer.service';
import { WINDOW } from '@ng-web-apis/common';

interface IMetamaskWindow extends Window {
  ethereum?: {
    isMetaMask?: boolean;
    on(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
  };
}

@Injectable({
  providedIn: 'root'
})
export class EthersProviderService {
  public isMetamaskInstalled$: Observable<boolean>;
  public isProviderInitialized$: Observable<boolean>;

  /**
   * A Provider (in ethers) is a class which provides an abstraction for a connection to the
   * Ethereum Network. It provides read-only access to the Blockchain and its status
   */
  private provider?: ethers.providers.Web3Provider;

  private readonly _isMetamaskInstalled$ = new BehaviorSubject(false);
  private readonly _isProviderInitialized$ = new BehaviorSubject(false);

  constructor(
    @Inject(WINDOW) private readonly window: IMetamaskWindow,
    private readonly ethersSignerService: EthersSignerService
  ) {
    this.isMetamaskInstalled$ = this._isMetamaskInstalled$.asObservable();
    this.isProviderInitialized$ = this._isProviderInitialized$.asObservable();
  }

  public async init(): Promise<void> {
    // Resolves ethereum provider (EIP-1193)
    const provider = (await detectEthereumProvider({
      mustBeMetaMask: true
    })) as Nullable<ethers.providers.ExternalProvider>;

    if (provider) {
      this.provider = new ethers.providers.Web3Provider(provider);

      this._isMetamaskInstalled$.next(true);
      this._isProviderInitialized$.next(true);

      this.setupSigner();

      return;
    }
  }

  /**
   * a.k.a. login
   */
  public requestAccounts(): Promise<string[]> {
    return this.provider!.send('eth_requestAccounts', []);
  }

  private setupSigner(): void {
    this.ethersSignerService.setSigner(this.provider!.getSigner());

    this.window.ethereum!.on('accountsChanged', (_accounts: string[]) =>
      this.ethersSignerService.setSigner(this.provider!.getSigner())
    );
  }
}
