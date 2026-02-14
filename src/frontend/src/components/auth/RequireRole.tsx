import { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { ShieldAlert } from 'lucide-react';

interface RequireRoleProps {
    children: ReactNode;
    requiredRole: 'traveler' | 'business';
}

export default function RequireRole({ children, requiredRole }: RequireRoleProps) {
    const { userProfile, isTraveler, isBusinessOwner } = useAuth();
    const navigate = useNavigate();

    const hasAccess =
        (requiredRole === 'traveler' && isTraveler) ||
        (requiredRole === 'business' && isBusinessOwner);

    if (!hasAccess) {
        return (
            <div className="container max-w-2xl mx-auto py-16 px-4">
                <Card>
                    <CardHeader className="text-center">
                        <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                            <ShieldAlert className="h-6 w-6 text-destructive" />
                        </div>
                        <CardTitle>Access Denied</CardTitle>
                        <CardDescription>
                            {requiredRole === 'business'
                                ? 'This section is only available to business owners.'
                                : 'This section is only available to travelers.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Button onClick={() => navigate({ to: '/' })}>
                            Return to Home
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <>{children}</>;
}
