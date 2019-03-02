import { Routes } from '@angular/router';
import { PageComponent } from 'shared/page/page.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterResolver } from './services/register.resolver';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const authRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: '',
                redirectTo: 'login'
            },
            {
                path: 'login',
                component: LoginComponent,
                resolve: {
                    ping: ContinuesInformationService
                }
            },
            {
                path: 'register',
                component: RegisterComponent,
                resolve: {
                    data: RegisterResolver
                }
            },
            {
                path: 'forgot-password',
                component: ForgotPasswordComponent
            }
        ]
    }
];
