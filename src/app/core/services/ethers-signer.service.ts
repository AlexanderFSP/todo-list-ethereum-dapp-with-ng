import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { nullable, Nullable } from '@core/models';
import { Address } from '@core/models/web3';
import { ethers } from 'ethers';

@Injectable({
  providedIn: 'root'
})
export class EthersSignerService {
  public currentAccount$: Observable<Nullable<Address>>;

  /**
   * A Signer is a class which (usually) in some way directly or indirectly has access
   * to a private key, which can sign messages and transactions to authorize the network
   * to charge your account ether to perform operations
   */
  private signer?: ethers.Signer;

  private readonly _currentAccount$ = new BehaviorSubject<Nullable<Address>>(null);

  constructor(private readonly ngZone: NgZone) {
    this.currentAccount$ = this._currentAccount$.asObservable();
  }

  public setSigner(signer: ethers.Signer): void {
    this.signer = signer;

    this.updateCurrentAccount();
  }

  private async updateCurrentAccount(): Promise<void> {
    let address: string;

    try {
      address = await this.signer!.getAddress();
    } catch {
    } finally {
      this.ngZone.run(() => this._currentAccount$.next(nullable(address)));
    }
  }
}
