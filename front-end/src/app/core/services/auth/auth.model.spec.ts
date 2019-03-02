import { AdminPermissions, AuthUser } from 'core/services/auth/auth.model';

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
});
