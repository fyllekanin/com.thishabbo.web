import { RouterModule } from '@angular/router';
import { JoshuaComponent } from './joshua/joshua.component';
import { JxshComponent } from './jxsh/jxsh.component';
import { DemoComponent } from './demo/demo.component';
import { PageModule } from 'shared/page/page.module';
import { ContentModule } from 'shared/app-views/content/content.module';
import { TitleModule } from 'shared/app-views/title/title.module';
import { schoolRoutes } from './school.routes';
import { NgModule } from '@angular/core';
import { DezComponent } from './dez/dez.component';
import { RoraComponent } from './rora/rora.component';
import { FormsModule } from '@angular/forms';
import { DemoService } from './demo/demo.service';
import { JoshuaService } from './joshua/Joshua.service';
import { JxshService } from './jxsh/jxsh.service';
import { RoraService } from './rora/rora.service';
import { DezService } from './dez/dez.service';
import { CommonModule } from '@angular/common';
import { UserLinkModule } from 'shared/components/user/user-link.module';

@NgModule({
    imports: [
        RouterModule.forChild(schoolRoutes),
        CommonModule,
        TitleModule,
        ContentModule,
        PageModule,
        FormsModule,
        UserLinkModule
    ],
    declarations: [
        JoshuaComponent,
        JxshComponent,
        DemoComponent,
        DezComponent,
        RoraComponent
    ],
    providers: [
        DemoService,
        JoshuaService,
        JxshService,
        RoraService,
        DezService
    ],
    exports: [
        RouterModule
    ]
})
export class SchoolModule {
}
