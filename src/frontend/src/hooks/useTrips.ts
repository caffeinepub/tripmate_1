import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TripDetails, TripPlan } from '../backend';
import { toast } from 'sonner';

export function useGetCallerTripPlans() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<TripPlan[]>({
        queryKey: ['callerTripPlans'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getCallerTripPlans();
        },
        enabled: !!actor && !actorFetching,
    });
}

export function useCreateTrip() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (tripDetails: TripDetails) => {
            if (!actor) throw new Error('Actor not available');
            return actor.createTrip(tripDetails);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['callerTripPlans'] });
            toast.success('Trip plan created successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create trip plan');
        },
    });
}
