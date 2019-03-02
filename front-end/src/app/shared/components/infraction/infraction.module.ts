import { NgModule } from '@angular/core';
import { InfractionComponent } from 'shared/components/infraction/infraction.component';
import { InfractionService } from 'shared/components/infraction/infraction.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        InfractionComponent
    ],
    providers: [
        InfractionService
    ],
    entryComponents: [
        InfractionComponent
    ]
})
export class InfractionModule {}
