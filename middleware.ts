import { authMiddleware } from '@clerk/nextjs';

// Protect specified routes, making them accessible only after login
export default authMiddleware({

  // publicRoutes: ['/', '/api/webhook', '/tags', '/tags/:id', '/community', '/profile/:id'],
  // ignoredRoutes: ['/api/webhook'],

});

export const config = {
  matcher: [
    '/',
    '/tags',
    '/tags/:id',
    '/profile/:id',
    '/(api|trpc)(.*)',
    '/((?!.+\\.[\\w]+$|_next).*)',
  ],
};
