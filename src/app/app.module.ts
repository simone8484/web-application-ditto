import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ModalComponent } from './modal/modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalContentComponent } from './modal/modal_content.component';
import { ConfirmState } from './modal/modal_state.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {LeafletModule} from '@asymmetrik/ngx-leaflet';
import { MapComponent } from './map/map.component';
import { ModalFilterComponent } from './modal _filter/modal-filter.component';
import { ModalFilterContentComponent } from './modal _filter/modal-filter_content.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GlobalService } from './services/global';
import { FilesService } from './services/files.services';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    ModalComponent,
    ModalContentComponent,
    ModalFilterComponent,
    ModalFilterContentComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    Ng2SmartTableModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    FormlyModule.forRoot(),
    FormlyBootstrapModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatProgressSpinnerModule,
    LeafletModule,
    NgSelectModule,
    HttpClientModule
    ],
  providers: [
    ModalComponent,
    ModalFilterComponent,
    ConfirmState,
    GlobalService,
    FilesService
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalContentComponent,
    ModalFilterContentComponent
  ],
  exports:[
    MatTabsModule,
    MatProgressSpinnerModule
  ]

})
export class AppModule { }
