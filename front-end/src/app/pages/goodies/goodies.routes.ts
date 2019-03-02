import { PageComponent } from 'shared/page/page.component';
import { Routes } from '@angular/router';
import { HabboImagerComponent } from './habbo-imager/habbo-imager.component';
import { ContinuesInformationService } from 'core/services/continues-information/continues-information.service';

export const goodiesRoutes: Routes = [
    {
        path: '',
        component: PageComponent,
        children: [
            {
                path: 'habbo-imager',
                component: HabboImagerComponent,
                resolve: {
                    ping: ContinuesInformationService
                }
            }
        ]
    }
];
