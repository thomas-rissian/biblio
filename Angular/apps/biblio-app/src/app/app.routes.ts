import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  // redirect root to task list
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'home', redirectTo: 'tasks', pathMatch: 'full' },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: false }) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}