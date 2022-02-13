import { Injectable } from '@angular/core';
import { ethers } from 'ethers';

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
    contractInterface: ethers.ContractInterface,
    signerOrProvider?: ethers.Signer | ethers.providers.Provider
  ): ethers.Contract {
    return new ethers.Contract(addressOrName, contractInterface, signerOrProvider);
  }
}
