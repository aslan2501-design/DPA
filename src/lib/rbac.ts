/**
 * Role-Based Access Control (RBAC) Utilities
 * Damietta Port Management System
 */

import { UserType } from '@/contexts/AuthContext';

export type RoleType = UserType;

// Role Classifications
export const ROLE_CLASSIFICATIONS = {
  MARITIME_AGENCY: 'agency',
  SHIPPING_COMPANY: 'shipping',
  ADMIN: 'admin',
  STAFF: 'staff',
  CHAIRMAN: 'chairman',
};

// Get the classification of a role
export const getRoleClassification = (userType: RoleType): string => {
  if (userType === 'COMMUNITY') {
    // For COMMUNITY, we need to check the classification from user object
    return 'community'; // Will be overridden by actual user classification
  }
  if (userType === 'ADMIN') return ROLE_CLASSIFICATIONS.ADMIN;
  if (userType === 'DPA_STAFF') return ROLE_CLASSIFICATIONS.STAFF;
  if (userType === 'CHAIRMAN') return ROLE_CLASSIFICATIONS.CHAIRMAN;
  return 'unknown';
};

// Check if user can see warehouse requests
export const canSeeWarehouseRequests = (userType: RoleType, classification?: string): boolean => {
  // Admin and Staff see everything
  if (userType === 'ADMIN' || userType === 'DPA_STAFF') return true;
  // Chairman see everything (read-only)
  if (userType === 'CHAIRMAN') return true;
  // Maritime agency CANNOT see warehouse requests
  if (classification === 'agency') return false;
  // Shipping company can see warehouse requests
  return true;
};

// Check if user can see trolley/berthing requests
export const canSeeTrolleyRequests = (userType: RoleType, classification?: string): boolean => {
  // Admin and Staff see everything
  if (userType === 'ADMIN' || userType === 'DPA_STAFF') return true;
  // Chairman see everything (read-only)
  if (userType === 'CHAIRMAN') return true;
  // Shipping company cannot see trolley requests
  if (classification === 'shipping') return false;
  // Maritime agency CAN see trolley requests
  return true;
};

// Check if user can see warehouse rental option in dashboard
export const canSeeWarehouseRentalInDashboard = (userType: RoleType, classification?: string): boolean => {
  // Admin and Staff see everything
  if (userType === 'ADMIN' || userType === 'DPA_STAFF') return true;
  // Maritime agency CANNOT see warehouse rental
  if (classification === 'agency') return false;
  // Others can see it
  return true;
};

// Check if user can see trolley request in dashboard
export const canSeeTrolleyRequestInDashboard = (userType: RoleType, classification?: string): boolean => {
  // Admin and Staff see everything
  if (userType === 'ADMIN' || userType === 'DPA_STAFF') return true;
  // Shipping company cannot see trolley option
  if (classification === 'shipping') return false;
  // Maritime agency CAN see trolley option
  return true;
};

// Check if user can see hydrography/analysis page
export const canSeeHydrography = (userType: RoleType, classification?: string): boolean => {
  // Admin and Staff see everything
  if (userType === 'ADMIN' || userType === 'DPA_STAFF') return true;
  // Chairman can see it (read-only)
  if (userType === 'CHAIRMAN') return true;
  // Maritime agency CANNOT see hydrography
  if (classification === 'agency') return false;
  // Shipping company cannot see hydrography
  if (classification === 'shipping') return false;
  // Others can see it
  return true;
};

// Check if user can see only their own requests
export const shouldFilterOwnRequests = (userType: RoleType): boolean => {
  // Community users see only their own requests
  if (userType === 'COMMUNITY') return true;
  // Admin and Staff see all
  return false;
};

// Check if user can see only their own complaints
export const shouldFilterOwnComplaints = (userType: RoleType): boolean => {
  // Community users see only their own complaints
  if (userType === 'COMMUNITY') return true;
  // Admin and Staff see all
  return false;
};

// Check if user can edit complaint status
export const canEditComplaintStatus = (userType: RoleType): boolean => {
  // Only Admin and Staff can edit complaint status
  return userType === 'ADMIN' || userType === 'DPA_STAFF';
};

// Check if user can approve/reject requests
export const canApproveRequests = (userType: RoleType): boolean => {
  // Only Admin and Staff can approve/reject
  return userType === 'ADMIN' || userType === 'DPA_STAFF';
};

// Check if user is admin or staff
export const isAdminOrStaff = (userType: RoleType): boolean => {
  return userType === 'ADMIN' || userType === 'DPA_STAFF';
};

/**
 * Get all visible requests based on user role
 */
export const getVisibleRequests = (
  allRequests: any[],
  userType: RoleType,
  userId?: string,
  userClassification?: string
) => {
  let filtered = allRequests;

  // Filter by role-specific visibility
  if (userType === 'COMMUNITY') {
    // Community users see only their own requests
    filtered = filtered.filter(req => req.userId === userId);
  } else if (userType === 'DPA_STAFF' || userType === 'ADMIN') {
    // These see all requests
    filtered = allRequests;
  } else if (userType === 'CHAIRMAN') {
    // Chairman sees all (read-only)
    filtered = allRequests;
  }

  // Filter by request type based on classification
  if (userClassification === ROLE_CLASSIFICATIONS.MARITIME_AGENCY) {
    // Maritime agency cannot see warehouse requests
    filtered = filtered.filter(req => req.type !== 'warehouse');
  } else if (userClassification === ROLE_CLASSIFICATIONS.SHIPPING_COMPANY) {
    // Shipping company cannot see trolley requests
    filtered = filtered.filter(req => req.type !== 'trolley');
  }

  return filtered;
};

/**
 * Get all visible complaints based on user role
 */
export const getVisibleComplaints = (
  allComplaints: any[],
  userType: RoleType,
  userId?: string,
  userClassification?: string
) => {
  let filtered = allComplaints;

  // Filter by role-specific visibility
  if (userType === 'COMMUNITY') {
    // Community users see only their own complaints
    filtered = filtered.filter(comp => comp.userId === userId);
  } else if (userType === 'DPA_STAFF' || userType === 'ADMIN') {
    // These see all complaints
    filtered = allComplaints;
  } else if (userType === 'CHAIRMAN') {
    // Chairman sees all (read-only)
    filtered = allComplaints;
  }

  return filtered;
};

/**
 * Get user activity (recent requests + complaints)
 */
export const getUserActivity = (
  requests: any[],
  complaints: any[],
  userType: RoleType,
  userId?: string,
  userClassification?: string
) => {
  const visibleRequests = getVisibleRequests(requests, userType, userId, userClassification);
  const visibleComplaints = getVisibleComplaints(
    complaints,
    userType,
    userId,
    userClassification
  );

  // Combine and sort by date
  const activity = [
    ...visibleRequests.map(req => ({
      ...req,
      type: 'request',
      timestamp: req.date,
    })),
    ...visibleComplaints.map(comp => ({
      ...comp,
      type: 'complaint',
      timestamp: comp.date,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return activity.slice(0, 5); // Return latest 5 activities
};
/**
 * Comprehensive role permission checker
 * Returns object with all permissions for the user
 */
export const getUserPermissions = (userType: RoleType, classification?: string) => {
  const basePermissions = {
    canViewMap: true,
    canViewComplaints: true,
    canCreateComplaints: true,
    canEditOwnComplaints: false,
    canViewRequests: false,
    canCreateRequests: false,
    canViewDashboard: true,
    canViewAdmin: false,
    canEditStatus: false,
    canApproveRequests: false,
    isReadOnly: false,
  };

  if (userType === 'ADMIN') {
    return {
      ...basePermissions,
      canViewMap: true,
      canViewComplaints: true,
      canCreateComplaints: false,
      canViewRequests: true,
      canCreateRequests: false,
      canViewDashboard: true,
      canViewAdmin: true,
      canEditStatus: true,
      canApproveRequests: true,
      isReadOnly: false,
    };
  }

  if (userType === 'DPA_STAFF') {
    return {
      ...basePermissions,
      canViewMap: true,
      canViewComplaints: true,
      canCreateComplaints: false,
      canViewRequests: true,
      canCreateRequests: false,
      canViewDashboard: true,
      canViewAdmin: false,
      canEditStatus: true,
      canApproveRequests: true,
      isReadOnly: false,
    };
  }

  if (userType === 'CHAIRMAN') {
    return {
      ...basePermissions,
      canViewMap: true,
      canViewComplaints: true,
      canCreateComplaints: false,
      canViewRequests: true,
      canCreateRequests: false,
      canViewDashboard: true,
      canViewAdmin: false,
      canEditStatus: false,
      canApproveRequests: false,
      isReadOnly: true,
    };
  }

  // COMMUNITY users with specific classifications
  if (userType === 'COMMUNITY') {
    if (classification === ROLE_CLASSIFICATIONS.MARITIME_AGENCY) {
      return {
        ...basePermissions,
        canViewMap: true,
        canViewComplaints: true,
        canCreateComplaints: true,
        canViewRequests: true,
        canCreateRequests: true,
        canViewDashboard: true,
        canViewAdmin: false,
        canEditStatus: false,
        canApproveRequests: false,
        isReadOnly: false,
      };
    }

    if (classification === ROLE_CLASSIFICATIONS.SHIPPING_COMPANY) {
      return {
        ...basePermissions,
        canViewMap: true,
        canViewComplaints: true,
        canCreateComplaints: true,
        canViewRequests: true,
        canCreateRequests: true,
        canViewDashboard: true,
        canViewAdmin: false,
        canEditStatus: false,
        canApproveRequests: false,
        isReadOnly: false,
      };
    }
  }

  return basePermissions;
};

/**
 * Check if page should be visible
 */
export const canAccessPage = (
  pageRoute: string,
  userType: RoleType,
  classification?: string
): boolean => {
  const permissions = getUserPermissions(userType, classification);

  switch (pageRoute) {
    case '/map':
      return permissions.canViewMap;
    case '/complaints':
      return permissions.canViewComplaints;
    case '/requests':
      return permissions.canViewRequests;
    case '/dashboard':
      return permissions.canViewDashboard;
    case '/admin':
      return permissions.canViewAdmin;
    default:
      return false;
  }
};

/**
 * Get action type for feedback context
 */
export const getActionTypeForFeedback = (
  userType: RoleType,
  classification?: string,
  actionType?: string
): string => {
  if (actionType) return actionType;
  if (classification === ROLE_CLASSIFICATIONS.MARITIME_AGENCY) {
    return 'maritime_agency_action';
  }
  if (classification === ROLE_CLASSIFICATIONS.SHIPPING_COMPANY) {
    return 'shipping_company_action';
  }
  return 'general_action';
};