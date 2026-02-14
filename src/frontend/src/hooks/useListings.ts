import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PromotedListing } from '../backend';
import { toast } from 'sonner';

export function useGetAllPromotedListings() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<PromotedListing[]>({
        queryKey: ['allPromotedListings'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getAllPromotedListings();
        },
        enabled: !!actor && !actorFetching,
    });
}

export function useGetCallerPromotedListings() {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<PromotedListing[]>({
        queryKey: ['callerPromotedListings'],
        queryFn: async () => {
            if (!actor) return [];
            return actor.getCallerPromotedListings();
        },
        enabled: !!actor && !actorFetching,
    });
}

export function useCreatePromotedListing() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (listing: PromotedListing) => {
            if (!actor) throw new Error('Actor not available');
            return actor.createPromotedListing(listing);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['callerPromotedListings'] });
            queryClient.invalidateQueries({ queryKey: ['allPromotedListings'] });
            toast.success('Listing created successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create listing');
        },
    });
}

export function useUpdatePromotedListing() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, listing }: { id: string; listing: PromotedListing }) => {
            if (!actor) throw new Error('Actor not available');
            return actor.updatePromotedListing(id, listing);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['callerPromotedListings'] });
            queryClient.invalidateQueries({ queryKey: ['allPromotedListings'] });
            toast.success('Listing updated successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update listing');
        },
    });
}

export function useDeletePromotedListing() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            if (!actor) throw new Error('Actor not available');
            return actor.deletePromotedListing(id);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['callerPromotedListings'] });
            queryClient.invalidateQueries({ queryKey: ['allPromotedListings'] });
            toast.success('Listing deleted successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to delete listing');
        },
    });
}

export function useFilterPromotedListingsByCategory(category: string) {
    const { actor, isFetching: actorFetching } = useActor();

    return useQuery<PromotedListing[]>({
        queryKey: ['promotedListings', 'category', category],
        queryFn: async () => {
            if (!actor) return [];
            return actor.filterPromotedListingsByCategory(category);
        },
        enabled: !!actor && !actorFetching && !!category,
    });
}
