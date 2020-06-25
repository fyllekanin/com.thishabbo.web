import { Routes } from '@angular/router';
import { JoshuaComponent } from './joshua/joshua.component';
import { JxshComponent } from './jxsh/jxsh.component';
import { DemoComponent } from './demo/demo.component';
import { DezComponent } from './dez/dez.component';
import { RoraComponent } from './rora/rora.component';

export const schoolRoutes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'joshua',
                component: JoshuaComponent
            },
            {
                path: 'jxsh',
                component: JxshComponent
            },
            {
                path: 'demo',
                component: DemoComponent
            },
            {
                path: 'dez',
                component: DezComponent
            },
            {
                path: 'rora',
                component: RoraComponent
            }
        ]
    }
];
