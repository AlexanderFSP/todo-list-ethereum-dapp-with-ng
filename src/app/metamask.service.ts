import { Inject, Injectable } from '@angular/core';
import { WINDOW } from '@ng-web-apis/common';
import detectEthereumProvider from '@metamask/detect-provider';
import { BehaviorSubject, Observable } from 'rxjs';
import { ethers } from 'ethers';
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import { Address } from '@core/models/web3';
import { nullable, Nullable } from '@core/models';

interface ConnectInfo {
  chainId: string;
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

interface ProviderMessage {
  type: string;
  data: unknown;
}

interface IMetamaskWindow extends Window {
  ethereum?: {
    isMetaMask: boolean;
    isConnected(): boolean;
    // request(args: { method: string; params?: unknown[] | object }): Promise<unknown>;
    request(args: { method: 'eth_chainId' }): Promise<string>;
    request(args: { method: 'eth_accounts' }): Promise<string[]>;
    request(args: { method: 'eth_sendTransaction'; params: ITransactionParams[] }): Promise<string[]>;
    // eth_sign, eth_personalSign, eth_signTypedData, ...
    on(event: 'accountsChanged', handler: (accounts: string[]) => void): void;
    on(event: 'chainChanged', handler: (chainId: string) => void): void;
    on(event: 'connect', handler: (connectInfo: ConnectInfo) => void): void;
    on(event: 'disconnect', handler: (error: ProviderRpcError) => void): void;
    on(event: 'message', handler: (message: ProviderMessage) => void): void;
  };
}

interface ITransactionParams {
  nonce?: string;
  gasPrice?: string;
  gas?: string;
  to?: Address;
  from: Address;
  value?: string;
  data?: string;
  chainId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetamaskService {
  public isMetamaskInstalled?: boolean;
  public readonly currentAccount$: Observable<Nullable<Address>>;

  /**
   * A Provider (in ethers) is a class which provides an abstraction for a connection to the
   * Ethereum Network. It provides read-only access to the Blockchain and its status
   *
   * TODO: Hide this prop.
   */
  public provider?: Web3Provider;
  private readonly _currentAccount$ = new BehaviorSubject<Nullable<Address>>(null);

  constructor(@Inject(WINDOW) private readonly window: IMetamaskWindow) {
    this.currentAccount$ = this._currentAccount$.asObservable();
  }

  /**
   * A Signer is a class which (usually) in some way directly or indirectly has access
   * to a private key, which can sign messages and transactions to authorize the network
   * to charge your account ether to perform operations
   */
  public get signer(): ethers.providers.JsonRpcSigner {
    return this.provider!.getSigner();
  }

  public async init(): Promise<void> {
    const provider = await detectEthereumProvider();

    if (!provider) {
      console.warn('Please install MetaMask!');

      return;
    }

    this.provider = new ethers.providers.Web3Provider(this.window.ethereum as ExternalProvider);

    this.isMetamaskInstalled = true;

    // const signer = this.provider.getSigner();

    const accounts = await this.getAccounts();

    this._currentAccount$.next(accounts[0]);

    this.listenAccountsChangedEvent();
  }

  public getChainId(): Promise<string> {
    return this.window.ethereum!.request({ method: 'eth_chainId' });
  }

  public getAccounts(): Promise<string[]> {
    return this.window.ethereum!.request({ method: 'eth_accounts' });
  }

  /**
   * a.k.a. login
   */
  public requestAccounts(): Promise<string[]> {
    return this.provider!.send('eth_requestAccounts', []);
  }

  public sendTransaction(params: ITransactionParams[]) {
    return this.window.ethereum!.request({ method: 'eth_sendTransaction', params });
  }

  public sendEther(to: Address, ether: string): Promise<ethers.providers.TransactionResponse> {
    return this.signer.sendTransaction({ to, value: ethers.utils.parseEther(ether) });
  }

  private listenAccountsChangedEvent(): void {
    this.window.ethereum!.on('accountsChanged', accounts => this._currentAccount$.next(nullable(accounts[0])));
  }
}
