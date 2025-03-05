export type Role = 'user' | 'developer' | 'admin';

export interface RouteProps {
  routeType?: Role;
  allowedRole?: Role;
  children: React.ReactNode;
} 