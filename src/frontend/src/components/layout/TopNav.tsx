import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../../hooks/useAuth';
import LoginButton from '../auth/LoginButton';
import { Button } from '@/components/ui/button';
import { MapPin, Menu } from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from '@/components/ui/sheet';
import { useState } from 'react';

export default function TopNav() {
    const { isAuthenticated, isTraveler, isBusinessOwner } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const NavLinks = () => (
        <>
            <Button
                variant="ghost"
                onClick={() => {
                    navigate({ to: '/' });
                    setOpen(false);
                }}
            >
                Home
            </Button>
            {isAuthenticated && isTraveler && (
                <Button
                    variant="ghost"
                    onClick={() => {
                        navigate({ to: '/planner' });
                        setOpen(false);
                    }}
                >
                    My Trips
                </Button>
            )}
            <Button
                variant="ghost"
                onClick={() => {
                    navigate({ to: '/explore' });
                    setOpen(false);
                }}
            >
                Explore
            </Button>
            {isAuthenticated && isBusinessOwner && (
                <Button
                    variant="ghost"
                    onClick={() => {
                        navigate({ to: '/dashboard' });
                        setOpen(false);
                    }}
                >
                    Dashboard
                </Button>
            )}
        </>
    );

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                    <MapPin className="h-6 w-6 text-primary" />
                    <span>TripMate</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-2">
                    <NavLinks />
                    <LoginButton />
                </nav>

                {/* Mobile Navigation */}
                <div className="flex md:hidden items-center gap-2">
                    <LoginButton />
                    <Sheet open={open} onOpenChange={setOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right">
                            <nav className="flex flex-col gap-4 mt-8">
                                <NavLinks />
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}
