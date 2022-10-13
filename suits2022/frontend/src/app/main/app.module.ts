import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule} from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router'
import {  ModalModule } from 'ngx-bootstrap/modal';
import { GaugeModule } from 'angular-gauge';


import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppComponent } from './app.component';
import { EMUService } from '../services/emu.service';
import { UIAComponent } from '../controllers/uia/uia.component';
import { DCUComponent } from '../controllers/dcu/dcu.component';

// Socket Connection
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

// const SocketConfig: SocketIoConfig = { url: 'http://localhost:3001', options: {
//   transports: ['websocket', 'polling', 'flashsocket']
// } };

const routes: Routes = [
  { path: 'uia', component: UIAComponent },
  { path: 'dcu', component: DCUComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    UIAComponent,
    DCUComponent,

  ],
  exports: [
    RouterModule 
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    MDBBootstrapModule.forRoot(),
    NgbModule.forRoot(),
    RouterModule.forRoot(routes),
    // SocketIoModule.forRoot(SocketConfig),
    ModalModule.forRoot(),
    GaugeModule.forRoot()
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA 
  ],
  providers: [

    EMUService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }



