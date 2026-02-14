import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { UserProfile } from '../backend';

export function useGetCallerUserProfile() {
    const { actor, isFetching: actorFetching } = useActor();
    const { identity } = useInternetIdentity();

    const query = useQuery<UserProfile | null>({
        queryKey: ['currentUserProfile', identity?.getPrincipal().toString()],
        queryFn: async () => {
            if (!actor) throw new Error('Actor not available');
            return actor.getCallerUserProfile();
        },
        enabled: !!actor && !actorFetching && !!identity,
        retry: false,
    });

    return {
        ...query,
        isLoading: actorFetching || query.isLoading,
        isFetched: !!actor && query.isFetched,
    };
}

export function useAuth() {
    const { identity, loginStatus } = useInternetIdentity();
    const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();

    const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();
    const isTraveler = isAuthenticated && userProfile?.appRole === 'traveler';
    const isBusinessOwner = isAuthenticated && userProfile?.appRole === 'business';

    return {
        isAuthenticated,
        isTraveler,
        isBusinessOwner,
        userProfile,
        profileLoading,
        isFetched,
        loginStatus,
    };
}
