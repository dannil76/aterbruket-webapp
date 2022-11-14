import React, { useState, useEffect } from 'react';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';

export interface User {
    name?: string;
    sub: string;
    email?: string;
    department?: string;
    company?: string;
    address?: string;
    postalCode?: string;
    isAdmin?: boolean;
}

export interface UserContextType {
    user: User;
    authState: string;
}

interface ProviderProps {
    children: React.ReactNode;
}

const EmptyUser = {
    name: '',
    sub: '',
    email: '',
    department: '',
    company: '',
    address: '',
    postalCode: '',
    isAdmin: false,
} as User;

const UserContext = React.createContext<UserContextType>({
    user: EmptyUser,
    authState: '',
});

function UserProvider({ children }: ProviderProps) {
    const [authState, setAuthState] = useState<string>('');
    const [user, setUser] = useState<User>(EmptyUser);

    useEffect(() => {
        return onAuthUIStateChange((nextAuthState, authData: any) => {
            setAuthState(nextAuthState);

            if (authData?.attributes) {
                const cognitoGroups =
                    authData?.signInUserSession?.accessToken?.payload[
                        'cognito:groups'
                    ];
                const isAdmin = !!(
                    cognitoGroups && cognitoGroups.includes('administrator')
                );

                setUser({
                    name: authData?.attributes?.name || EmptyUser.name,
                    sub: authData?.attributes?.sub || EmptyUser.sub,
                    email: authData?.attributes?.email || EmptyUser.email,
                    department:
                        authData?.attributes['custom:department'] ||
                        EmptyUser.department,
                    company:
                        authData?.attributes['custom:company'] ||
                        EmptyUser.company,
                    address: authData?.attributes?.address || EmptyUser.address,
                    postalCode:
                        authData?.attributes['custom:postalcode'] ||
                        EmptyUser.postalCode,
                    isAdmin,
                });
            }
        });
    }, []);

    return (
        <UserContext.Provider value={{ user, authState }}>
            {children}
        </UserContext.Provider>
    );
}

export { UserProvider };
export default UserContext;
