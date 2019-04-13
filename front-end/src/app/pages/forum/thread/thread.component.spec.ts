import { DialogService } from 'core/services/dialog/dialog.service';
import { BreadcrumbService } from 'core/services/breadcrum/breadcrumb.service';
import { ForumPermissions } from '../forum.model';
import { throwError, Subject } from 'rxjs';
import { AuthService } from 'core/services/auth/auth.service';
import { HttpService } from 'core/services/http/http.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ThreadComponent } from './thread.component';
import { NotificationService } from 'core/services/notification/notification.service';
import { EditorAction } from 'shared/components/editor/editor.model';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ThreadActions, ThreadPage } from './thread.model';
import { ActivatedRoute } from '@angular/router';
import { ThreadService } from '../services/thread.service';
import { PostModel } from '../post/post.model';
import { SafeStyleModule } from 'shared/pipes/safe-style/safe-style.module';

describe('ThreadComponent', () => {

    class HttpServiceMock {
        post() {}
    }
    class AuthServiceMock {
        isLoggedIn() {}
        get authUser() {
            return { userId: 1 };
        }
    }
    class NotificationServiceMock {
        sendGlobalNotification() {}
        failureNotification() {}
    }

    let fixture: ComponentFixture<ThreadComponent>;
    let component: ThreadComponent;
    let httpService: HttpServiceMock;
    let authService: AuthServiceMock;
    let notificationService: NotificationServiceMock;
    const sendThread: Subject<{ data: ThreadPage }> = new Subject();

    beforeEach(() => {
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
                { provide: ActivatedRoute, useValue: { data: sendThread.asObservable() } },
                { provide: BreadcrumbService, useValue: { set breadcrumb(_val) {} } },
                { provide: DialogService, useValue: {} },
                { provide: ThreadService, useValue: {} }
            ],
            schemas: [ NO_ERRORS_SCHEMA ]
        });

        fixture = TestBed.createComponent(ThreadComponent);
        component = fixture.componentInstance;
    });

    describe('onButtonClick', () => {
        it('should call failureNotification on failed POST', () => {
            // Given
            spyOn(notificationService, 'failureNotification');
            spyOn(httpService, 'post').and.returnValue(throwError({ error: { message: 'Message' } }));

            // When
            component.onButtonClick(new EditorAction({ title: 'test', value: ThreadActions.POST }));

            // Then
            expect(httpService.post).toHaveBeenCalledTimes(1);
            expect(notificationService.failureNotification).toHaveBeenCalled();
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

    describe('subTitle', () => {
        it('should return empty string if thread is open', () => {
            // Given
            sendThread.next({ data: new ThreadPage({ isOpen: true }) });

            // When
            const result = component.subTitle;

            // Then
            expect(result).toBe('');
        });
        it('should return non-empty string if thread is closed', () => {
            // Given
            sendThread.next({
                data: new ThreadPage({
                    isOpen: false
                })
            });

            // When
            const result = component.subTitle;

            // Then
            expect(result).not.toBe('');
        });
    });

    it('posts should return thread posts with lowest ID first', () => {
        // Given
        sendThread.next({
            data: new ThreadPage({
                threadPosts: [
                    new PostModel({postId: 2}),
                    new PostModel({postId: 1})
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
            sendThread.next({
                data: new ThreadPage({
                    isOpen: true,
                    categoryIsOpen: true
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
            sendThread.next({
                data: new ThreadPage({
                    isOpen: false,
                    categoryIsOpen: true,
                    forumPermissions: new ForumPermissions({ canCloseOpenThread: true })
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
            sendThread.next({
                data: new ThreadPage({
                    isOpen: true,
                    categoryIsOpen: true
                })
            });

            // When
            const result = component.cantPostReason;

            // Then
            expect(result.length).toBe(0);
        });
    });
});
