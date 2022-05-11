import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard'

//Enviar al login si no esta autorizado
const redirectUnauthorizedToLogin = () => {
  return redirectUnauthorizedTo(['/']);
}
//Si esta ingresado, que vaya a la vista partidos
const redirectLoggedInToMain = () => {
  return redirectLoggedInTo(['home','home','partidos']);
}


const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToMain)
  },
  {
    path: 'signin',
    loadChildren: () => import('./pages/signin/signin.module').then( m => m.SigninPageModule),
    ...canActivate(redirectLoggedInToMain)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then( m => m.SignupPageModule),
    ...canActivate(redirectLoggedInToMain)
  },
  {
    path: 'profilesetup',
    loadChildren: () => import('./pages/profilesetup/profilesetup.module').then( m => m.ProfilesetupPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'fields',
    loadChildren: () => import('./pages/fields/fields.module').then( m => m.FieldsPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'addfield',
    loadChildren: () => import('./pages/addfield/addfield.module').then( m => m.AddfieldPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'horarios',
    loadChildren: () => import('./pages/horarios/horarios.module').then( m => m.HorariosPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },{
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'matches-detail/:id',
    loadChildren: () => import('./pages/matches-detail/matches-detail.module').then( m => m.MatchesDetailPageModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'verify-email',
    loadChildren: () => import('./pages/verify-email/verify-email.module').then( m => m.VerifyEmailPageModule),
    ...canActivate(redirectLoggedInToMain)
  },
  {
    path: 'password-reset',
    loadChildren: () => import('./pages/password-reset/password-reset.module').then( m => m.PasswordResetPageModule),
    ...canActivate(redirectLoggedInToMain)
  },
  {
    path: 'field-details/:id',
    loadChildren: () => import('./pages/field-details/field-details.module').then( m => m.FieldDetailsPageModule)
  }


];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
