import { GroupsComponent } from './groups.component';
import { TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NotificationService } from 'core/services/notification/notification.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { GroupsService } from '../services/groups.service';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { HttpService } from 'core/services/http/http.service';
import { UserCpGroup } from './groups.model';

describe('GroupsComponent', () => {

    class ActivatedRouteMock {
        subject = new Subject();

        get data () {
            return this.subject.asObservable();
        }
    }

    let component: GroupsComponent;
    let activatedRoute;

    beforeEach(() => {
        activatedRoute = new ActivatedRouteMock();
        TestBed.configureTestingModule({
            imports: [
                CommonModule
            ],
            declarations: [
                GroupsComponent
            ],
            providers: [
                { provide: HttpService, useValue: {} },
                { provide: NotificationService, useValue: {} },
                { provide: DialogService, useValue: {} },
                {
                    provide: GroupsService, useValue: {
                        updateDisplayGroup () {
                            return null;
                        }
                    }
                },
                {
                    provide: BreadcrumbService, useValue: {
                        set breadcrum (_data) {
                            this.data = _data;
                        }
                    }
                },
                { provide: ActivatedRoute, useValue: activatedRoute }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        component = TestBed.createComponent(GroupsComponent).componentInstance;
    });

    it('updateDisplayGroup should update it to back-end', done => {
        // Given
        const service = TestBed.inject(GroupsService);
        const expectedGroup = new UserCpGroup(null);
        spyOn(service, 'updateDisplayGroup').and.callFake(displayGroup => {
            expect(displayGroup).toEqual(expectedGroup);
            done();
        });
        activatedRoute.subject.next({
            data: {
                displayGroup: expectedGroup
            }
        });

        // When
        component.updateDisplayGroup();
    });

    it('nonMemberPulicGroups should return all public groups the user is not a member of', () => {
        // Given
        activatedRoute.subject.next({
            data: {
                groups: [
                    { isMember: true, isPublic: true },
                    { isMember: false, isPublic: true },
                    { isMember: true, isPublic: false }
                ]
            }
        });

        // When
        const result = component.nonMemberPublicGroups;

        // Then
        expect(result.length).toEqual(1);
    });

    it('memberGroups should return all groups the user is a member of', () => {
        // Given
        activatedRoute.subject.next({
            data: {
                groups: [
                    { isMember: true, isPublic: true },
                    { isMember: false, isPublic: true },
                    { isMember: true, isPublic: false }
                ]
            }
        });

        // When
        const result = component.memberGroups;

        // Then
        expect(result.length).toEqual(2);
    });

    describe('get displayGroupId', () => {
        it('should return 0 if displayGroupId is not set', () => {
            // Given
            activatedRoute.subject.next({
                data: {
                    displayGroup: null
                }
            });

            // When
            const result = component.displayGroupId;

            // Then
            expect(result).toEqual(0);
        });
        it('should return groupId of displayGroupId if set', () => {
            // Given
            activatedRoute.subject.next({
                data: {
                    displayGroup: { groupId: 5 }
                }
            });

            // When
            const result = component.displayGroupId;

            // Then
            expect(result).toEqual(5);
        });
    });

    it('set displayGroupId should set displayGroupId to the group object', () => {
        // Given
        activatedRoute.subject.next({
            data: {
                displayGroup: null,
                groups: [ {
                    groupId: 2,
                    name: 'test'
                } ]
            }
        });

        // When
        component.displayGroupId = 2;

        // Then
        expect(component.displayGroupId).toEqual(2);
    });
});
