import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { RequestComponent } from './request/request.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';





@NgModule({
  declarations: [
    AppComponent,
    AdminDashboardComponent,
    RequestComponent,
    ForgotPasswordComponent,

  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
 
  ],
  providers: [
    provideClientHydration()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
