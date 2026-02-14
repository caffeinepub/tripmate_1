import { Heart } from 'lucide-react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const appIdentifier = typeof window !== 'undefined' 
        ? encodeURIComponent(window.location.hostname) 
        : 'tripmate-app';

    return (
        <footer className="border-t bg-muted/30 py-8 mt-auto">
            <div className="container px-4">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    <p className="text-sm text-muted-foreground">
                        © {currentYear} TripMate. All rights reserved.
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                        Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
                        <a
                            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium hover:underline"
                        >
                            caffeine.ai
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
