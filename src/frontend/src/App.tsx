import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import TripPlannerPage from './pages/TripPlannerPage';
import TripPlanDetailPage from './pages/TripPlanDetailPage';
import ExploreListingsPage from './pages/ExploreListingsPage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';

const rootRoute = createRootRoute({
    component: () => (
        <AppLayout>
            <Outlet />
        </AppLayout>
    ),
});

const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: LandingPage,
});

const tripPlannerRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/planner',
    component: () => (
        <RequireAuth>
            <TripPlannerPage />
        </RequireAuth>
    ),
});

const tripPlanDetailRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/trip/$tripId',
    component: () => (
        <RequireAuth>
            <TripPlanDetailPage />
        </RequireAuth>
    ),
});

const exploreListingsRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/explore',
    component: ExploreListingsPage,
});

const ownerDashboardRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/dashboard',
    component: () => (
        <RequireAuth>
            <RequireRole requiredRole="business">
                <OwnerDashboardPage />
            </RequireRole>
        </RequireAuth>
    ),
});

const routeTree = rootRoute.addChildren([
    indexRoute,
    tripPlannerRoute,
    tripPlanDetailRoute,
    exploreListingsRoute,
    ownerDashboardRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

export default function App() {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <RouterProvider router={router} />
            <Toaster />
        </ThemeProvider>
    );
}
