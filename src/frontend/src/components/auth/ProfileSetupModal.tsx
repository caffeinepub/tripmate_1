import { useState } from 'react';
import { useCreateProfile } from '../../hooks/useProfile';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2 } from 'lucide-react';

interface ProfileSetupModalProps {
    open: boolean;
}

export default function ProfileSetupModal({ open }: ProfileSetupModalProps) {
    const [name, setName] = useState('');
    const [role, setRole] = useState<'traveler' | 'business'>('traveler');
    const createProfile = useCreateProfile();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;
        await createProfile.mutateAsync({ role, name: name.trim() });
    };

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Welcome to TripMate!</DialogTitle>
                    <DialogDescription>
                        Let's set up your profile to get started.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Your Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-3">
                        <Label>I am a...</Label>
                        <RadioGroup value={role} onValueChange={(v) => setRole(v as 'traveler' | 'business')}>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="traveler" id="traveler" />
                                <Label htmlFor="traveler" className="font-normal cursor-pointer">
                                    Traveler - Plan and manage trips
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="business" id="business" />
                                <Label htmlFor="business" className="font-normal cursor-pointer">
                                    Business Owner - Promote my travel business
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <Button type="submit" className="w-full" disabled={createProfile.isPending || !name.trim()}>
                        {createProfile.isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating Profile...
                            </>
                        ) : (
                            'Get Started'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}
