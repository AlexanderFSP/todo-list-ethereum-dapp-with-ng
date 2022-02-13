import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetamaskAccountComponent } from './metamask-account.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [MetamaskAccountComponent],
  imports: [CommonModule, MatButtonModule],
  exports: [MetamaskAccountComponent]
})
export class MetamaskAccountModule {}
