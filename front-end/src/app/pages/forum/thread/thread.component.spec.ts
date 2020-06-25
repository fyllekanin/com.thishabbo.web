import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { User } from 'core/services/auth/auth.model';
import { AuthService } from 'core/services/auth/auth.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { DialogService } from 'core/services/dialog/dialog.service';
import { HttpService } from 'core/services/http/http.service';
import { NotificationService } from 'core/services/notification/notification.service';
import { of, Subject } from 'rxjs';
import { EditorAction } from 'shared/components/editor/editor.model';
import { AutoSaveHelper } from 'shared/helpers/auto-save.helper';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';
import { AutoSave, ForumPermissions } from '../forum.model';
import { PostModel } from '../post/post.model';
import { ThreadService } from '../services/thread.service';
import { ThreadComponent } from './thread.component';
import { ThreadActions, ThreadPage } from './thread.model';
import { EditorComponent } from 'shared/components/editor/editor.component';

describe('ThreadComponent', () => {

    class HttpServiceMock {
        post () {
            return null;
        }
    }

    class AuthServiceMock {
        isLoggedIn () {
            return true;
        }

        get authUser () {
            return { userId: 1 };
        }
    }

    class NotificationServiceMock {
        failureNotification () {
            // Empty
        }

        sendInfoNotification () {
            // Empty
        }
    }

    let fixture: ComponentFixture<ThreadComponent>;
    let component: ThreadComponent;
    let httpService: HttpServiceMock;
    let authService: AuthServiceMock;
    let notificationService: NotificationServiceMock;
    let threadService: ThreadService;
    const sendThread: Subject<{ data: ThreadPage }> = new Subject();

    beforeEach(() => {
        threadService = <ThreadService><unknown>{ createPost: () => ({ subscribe: () => null }) };
        httpService = new HttpServiceMock();
        authService = new AuthServiceMock();
        notificationService = new NotificationServiceMock();

        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                SafeStyleModule
            ],
            declarations: [
                ThreadComponent
            ],
            providers: [
                { provide: HttpService, useValue: httpService },
                { provide: AuthService, useValue: authService },
                { provide: NotificationService, useValue: notificationService },
                { provide: ActivatedRoute, useValue: { data: sendThread.asObservable(), params: {} } },
                {
                    provide: BreadcrumbService, useValue: {
                        set breadcrumb (_val) {
                            // Empty
                        }
                    }
                },
                { provide: DialogService, useValue: {} },
                { provide: ThreadService, useValue: threadService }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(ThreadComponent);
        component = fixture.componentInstance;
        component.editor = <EditorComponent><unknown>{ content: '', getEditorValue: () => '' };
    });

    it('trackPosts should return the updatedAt from the postModel', () => {
        // Given
        const item = new PostModel({ updatedAt: 123 });

        // When
        const result = component.trackPosts(0, item);

        // Then
        expect(result).toEqual(123);
    });

    describe('onKeyUp', () => {
        it('should not do anything if content is not set', fakeAsync(() => {
            // Given
            const content = null;
            component['_threadPage'] = new ThreadPage({ threadId: 5 });

            // When
            component.onKeyUp(content);
            tick(201);

            // Then
            expect(AutoSaveHelper.get(AutoSave.POST, 99)).toBeNull();
        }));
        it('should save the content as auto save', fakeAsync(() => {
            // Given
            const content = 'test';
            component['_threadPage'] = new ThreadPage({ threadId: 5 });

            // When
            component.onKeyUp(content);
            tick(201);

            // Then
            expect(AutoSaveHelper.get(AutoSave.POST, 5).content).toEqual('test');
        }));
    });

    describe('onButtonClick', () => {
        it('should call createPost on the thread service with threadId and content', done => {
            // Given
            spyOn(TestBed.inject(ThreadService), 'createPost').and.callFake((threadId: number, content: string, toggleThread: boolean) => {
                expect(threadId).toBeUndefined();
                expect(content).toEqual('');
                expect(toggleThread).toBeFalsy();
                done();
                return of(new PostModel({ isApproved: true }));
            });

            // When
            component.onButtonClick(new EditorAction({ title: 'test', value: ThreadActions.POST }));
        });
    });

    describe('toggleFixedTools', () => {
        it('should set fixed tools to a new instance if they are not hidden', () => {
            // Given
            // When
            component.onTabClick(ThreadActions.TOGGLE_TOOLS);

            // Then
            expect(component.fixedTools).not.toBeNull();
        });
        it('should set the fixed tools to null if hidden', () => {
            // Given
            // When
            component.onTabClick(ThreadActions.TOGGLE_TOOLS);
            component.onTabClick(ThreadActions.TOGGLE_TOOLS);

            // Then
            expect(component.fixedTools).toBeNull();
        });
    });

    it('posts should return thread posts with lowest ID first', () => {
        // Given
        sendThread.next({
            data: new ThreadPage({
                threadPosts: [
                    new PostModel({ postId: 2 }),
                    new PostModel({ postId: 1 })
                ]
            })
        });

        // When
        const result = component.posts;

        // Then
        expect(result[0].postId).toBe(1);
        expect(result[1].postId).toBe(2);
    });

    describe('canPost', () => {
        it('should return false if user is not logged in', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(false);

            // When
            const result = component.canPost;

            // Then
            expect(result).toBeFalsy();
        });

        it('should return false if thread is closed', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(true);
            sendThread.next({
                data: new ThreadPage({
                    isOpen: false
                })
            });

            // When
            const result = component.canPost;

            // Then
            expect(result).toBeFalsy();
        });

        it('should return true if thread is open', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(true);
            spyOnProperty(authService, 'authUser', 'get').and.returnValue({ userId: 1 });
            sendThread.next({
                data: new ThreadPage({
                    isOpen: true,
                    categoryIsOpen: true,
                    user: new User({
                        userId: 1
                    })
                })
            });

            // When
            const result = component.canPost;

            // Then
            expect(result).toBeTruthy();
        });

        it('should return true if thread is closed but have canCloseOpenThread permission and category is open', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(true);
            spyOnProperty(authService, 'authUser', 'get').and.returnValue({ userId: 1 });
            sendThread.next({
                data: new ThreadPage({
                    isOpen: false,
                    categoryIsOpen: true,
                    forumPermissions: new ForumPermissions({ canCloseOpenThread: true }),
                    user: new User({
                        userId: 1
                    })
                })
            });

            // When
            const result = component.canPost;

            // Then
            expect(result).toBeTruthy();
        });
    });

    describe('cantPostReason', () => {
        it('should return message if user is not logged in', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(false);

            // When
            const result = component.cantPostReason;

            // Then
            expect(result.length).not.toBe(0);
        });
        it('should return message if thread is closed', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(true);
            sendThread.next({
                data: new ThreadPage({
                    isOpen: false
                })
            });

            // When
            const result = component.cantPostReason;

            // Then
            expect(result.length).not.toBe(0);
        });
        it('should return message if category is closed', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(true);
            sendThread.next({
                data: new ThreadPage({
                    isOpen: true,
                    categoryIsOpen: false
                })
            });

            // When
            const result = component.cantPostReason;

            // Then
            expect(result.length).not.toBe(0);
        });
        it('should return empty message if nothing', () => {
            // Given
            spyOn(authService, 'isLoggedIn').and.returnValue(true);
            spyOnProperty(authService, 'authUser', 'get').and.returnValue({ userId: 1 });
            sendThread.next({
                data: new ThreadPage({
                    isOpen: true,
                    categoryIsOpen: true,
                    user: new User({
                        userId: 1
                    })
                })
            });

            // When
            const result = component.cantPostReason;

            // Then
            expect(result.length).toBe(0);
        });
    });
});
