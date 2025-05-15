import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DatingProfileComponent } from "./dating-profile.component";


const routes: Routes = [
    {
      path: "",
      component: DatingProfileComponent,
    }

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  })
export class DatingProfileRoutingModule {}
