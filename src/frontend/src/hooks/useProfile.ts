import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile } from '../backend';
import { toast } from 'sonner';

export function useCreateProfile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ role, name }: { role: string; name: string }) => {
            if (!actor) throw new Error('Actor not available');
            return actor.createProfile(role, name);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
            toast.success('Profile created successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to create profile');
        },
    });
}

export function useSaveCallerUserProfile() {
    const { actor } = useActor();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (profile: UserProfile) => {
            if (!actor) throw new Error('Actor not available');
            return actor.saveCallerUserProfile(profile);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
            toast.success('Profile updated successfully!');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Failed to update profile');
        },
    });
}
