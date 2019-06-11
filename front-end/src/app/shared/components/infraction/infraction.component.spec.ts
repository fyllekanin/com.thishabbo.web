import { InfractionComponent } from 'shared/components/infraction/infraction.component';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Infraction, InfractionContext, InfractModel } from 'shared/components/infraction/infraction.model';
import { SlimUser } from 'core/services/auth/auth.model';
import { InfractionLevel } from '../../../pages/sitecp/sub-pages/moderation/infraction-levels/infraction-level.model';

describe('InfractionComponent', () => {

    let component: InfractionComponent;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule
            ],
            declarations: [
                InfractionComponent
            ]
        });

        component = TestBed.createComponent(InfractionComponent).componentInstance;
    });

    it('getData should create an InfractModel with correct data', () => {
        // Given
        component.infractionLevelId = 5;
        component.reason = 'test';
        component.setData(new InfractionContext({
            user: new SlimUser({ userId: 2 })
        }));

        // When
        const result = component.getData();

        // Then
        expect(result).toEqual(new InfractModel({
            infractionLevelId: 5,
            reason: 'test',
            userId: 2
        }));
    });

    describe('levels', () => {
        it('should return empty array if data is not set', () => {
            // Given
            component.setData(null);

            // When
            const result = component.levels;

            // Then
            expect(result).toEqual([]);
        });
        it('should should return levels from data if set', () => {
            // Given
            component.setData(new InfractionContext({
                levels: [new InfractionLevel({ infractionLevelId: 1 })]
            }));

            // When
            const result = component.levels;

            // Then
            expect(result.length).toEqual(1);
            expect(result[0].infractionLevelId).toEqual(1);
        });
    });

    describe('history', () => {
        it('should return empty array if data not set', () => {
            // Given
            component.setData(null);

            // When
            const result = component.history;

            // Then
            expect(result).toEqual([]);
        });
        it('should return history from data if set', () => {
            // Given
            component.setData(new InfractionContext({
                history: [new Infraction({ title: 'test' })]
            }));

            // When
            const result = component.history;

            // Then
            expect(result.length).toEqual(1);
            expect(result[0].title).toEqual('test');
        });
    });
});
