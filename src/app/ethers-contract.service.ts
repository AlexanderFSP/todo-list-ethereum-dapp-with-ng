import { Injectable } from '@angular/core';
import { Provider } from '@ethersproject/providers';
import { Contract, ContractInterface, ethers, Signer } from 'ethers';

/**
 * A Contract is an abstraction which represents a connection to a specific contract on the
 * Ethereum Network, so that applications can use it like a normal JavaScript object
 */
@Injectable({
  providedIn: 'root'
})
export class EthersContractService {
  public createContract(
    addressOrName: string,
    contractInterface: ContractInterface,
    signerOrProvider?: Signer | Provider
  ): Contract {
    return new ethers.Contract(addressOrName, contractInterface, signerOrProvider);
  }
}
