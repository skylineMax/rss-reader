import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { IonicStorageModule } from '@ionic/storage';
import { FeedService } from '../providers/feed-service/feed-service';
import { ChartsPage } from '../pages/charts/charts';
import { HttpModule } from '@angular/http';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ChartsModule } from 'ng2-charts';
import { ChartStatProvider } from '../providers/chart-stat/chart-stat';

@NgModule({
  declarations: [
    MyApp,
    ChartsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    ChartsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ChartsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FeedService,
    InAppBrowser,
    ChartStatProvider
  ]
})
export class AppModule {}
