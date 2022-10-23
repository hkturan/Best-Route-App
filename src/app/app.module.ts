import {ErrorHandler, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {ButtonModule} from 'primeng/button';
import {InputNumberModule} from 'primeng/inputnumber';
import {FormsModule} from '@angular/forms';
import {TableModule} from 'primeng/table';
import {TooltipModule} from 'primeng/tooltip';
import {StepsModule} from 'primeng/steps';
import {MessageModule} from 'primeng/message';
import {MessagesModule} from 'primeng/messages';
import { RouteComponent } from './components/route/route.component';
import {CounterService} from './services/counter.service';
import {InputSwitchModule} from 'primeng/inputswitch';
import { CoordinateSearchComponent } from './components/coordinate-search/coordinate-search.component';
import { StepsComponent } from './components/steps/steps.component';
import { StepSelectStartPointComponent } from './components/steps/step-select-start-point/step-select-start-point.component';
import {ProgressBarModule} from 'primeng/progressbar';
import {OrderListModule} from 'primeng/orderlist';
import {ToastModule} from 'primeng/toast';
import {MessageService} from 'primeng/api';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {GlobalErrorHandler} from 'global-error-handler';
import { RoutePlanComponent } from './components/route-plan/route-plan.component';
import {MapService} from './services/map.service';
import { StepMarkerSelectionComponent } from './components/steps/step-marker-selection/step-marker-selection.component';
import { StepPreviewRoutePlanComponent } from './components/steps/step-preview-route-plan/step-preview-route-plan.component';
import { StepSelectEndPointComponent } from './components/steps/step-select-end-point/step-select-end-point.component';
import { MarkerInfoComponent } from './components/marker-info/marker-info.component';
import {OverlayPanelModule} from 'primeng/overlaypanel';

@NgModule({
  declarations: [
    AppComponent,
    RouteComponent,
    CoordinateSearchComponent,
    StepsComponent,
    StepSelectStartPointComponent,
    RoutePlanComponent,
    StepMarkerSelectionComponent,
    StepPreviewRoutePlanComponent,
    StepSelectEndPointComponent,
    MarkerInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ButtonModule,
    InputNumberModule,
    FormsModule,
    TableModule,
    TooltipModule,
    StepsModule,
    MessageModule,
    MessagesModule,
    InputSwitchModule,
    ProgressBarModule,
    OrderListModule,
    ToastModule,
    MessagesModule,
    MessageModule,
    BrowserAnimationsModule,
    OverlayPanelModule
  ],
  providers: [CounterService, MessageService, MapService],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule {
}
