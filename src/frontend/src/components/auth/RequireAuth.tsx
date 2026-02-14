import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Lock, Loader2 } from 'lucide-react';
import ProfileSetupModal from './ProfileSetupModal';

interface RequireAuthProps {
    children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
    const { isAuthenticated, userProfile, profileLoading, isFetched, loginStatus } = useAuth();
    const { login } = useInternetIdentity();

    const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

    if (loginStatus === 'initializing' || profileLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="container max-w-2xl mx-auto py-16 px-4">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Lock className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle>Authentication Required</CardTitle>
                        <CardDescription>
                            Please log in to access this feature
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={login} size="lg">
                            Login to Continue
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (showProfileSetup) {
        return <ProfileSetupModal open={true} />;
    }

    return <>{children}</>;
}
