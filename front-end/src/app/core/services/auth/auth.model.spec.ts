import {
    AdminPermissions,
    AuthUser,
    DisplayGroup,
    SlimUser,
    StaffPermissions,
    User,
    UserBadge,
    UserBar,
    UserSocial
} from 'core/services/auth/auth.model';

describe('Auth Model', () => {

    describe('isAdmin', () => {
        it('should return false if adminPermissions isAdmin is false', () => {
            // Given
            const authUser = new AuthUser({
                adminPermissions: new AdminPermissions({
                    isAdmin: false
                })
            });

            // Then
            expect(authUser.isAdmin).toBeFalsy();
        });
        it('should return true if adminPermissions isAdmin is true', () => {
            // Given
            const authUser = new AuthUser({
                adminPermissions: new AdminPermissions({
                    isAdmin: true
                })
            });

            // Then
            expect(authUser.isAdmin).toBeTruthy();
        });
    });

    describe('isStaff', () => {
        it('should return false if staffPermissions isStaff is false', () => {
            // Given
            const authUser = new AuthUser({
                staffPermissions: new StaffPermissions({
                    isStaff: false
                })
            });

            // Then
            expect(authUser.isStaff).toBeFalsy();
        });
        it('should return true if staffPermissions isStaff is true', () => {
            // Given
            const authUser = new AuthUser({
                staffPermissions: new StaffPermissions({
                    isStaff: true
                })
            });

            // Then
            expect(authUser.isStaff).toBeTruthy();
        });
    });

    it('User should be able to be constructed', () => {
        // When
        const result = new User();

        // Then
        expect(result instanceof User).toBeTruthy();
    });

    it('SlimUser should be able to be constructed', () => {
        // When
        const result = new SlimUser();

        // Then
        expect(result instanceof SlimUser).toBeTruthy();
    });

    it('UserSocial should be able to be constructed', () => {
        // When
        const result = new UserSocial({});

        // Then
        expect(result instanceof UserSocial).toBeTruthy();
    });

    it('UserBar should be able to be constructed', () => {
        // When
        const result = new UserBar({});

        // Then
        expect(result instanceof UserBar).toBeTruthy();
    });

    it('DisplayGroup should be able to be constructed', () => {
        // When
        const result = new DisplayGroup({});

        // Then
        expect(result instanceof DisplayGroup).toBeTruthy();
    });

    it('UserBadge should be able to be constructed', () => {
        // When
        const result = new UserBadge({});

        // Then
        expect(result instanceof UserBadge).toBeTruthy();
    });
});
