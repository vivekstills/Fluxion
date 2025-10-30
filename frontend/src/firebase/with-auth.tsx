'use client';

import { useUser } from '@/firebase/provider';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function WithAuth(props: P) {
    const { user, isUserLoading } = useUser();

    if (isUserLoading) {
      return <div className="flex items-center justify-center h-full">Loading...</div>;
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-gray-500">You must be logged in to view this page.</p>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
