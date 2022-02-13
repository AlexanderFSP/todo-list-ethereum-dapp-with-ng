import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { MetamaskAccountComponent } from './metamask-account.component';

@NgModule({
  declarations: [MetamaskAccountComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [MetamaskAccountComponent]
})
export class MetamaskAccountModule {}
