import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserType = 'DPA_STAFF' | 'COMMUNITY' | 'ADMIN' | 'CHAIRMAN';
export type Permission = 'VIEW_ALL' | 'VIEW_REPORTS' | 'VIEW_REQUESTS' | 'VIEW_COMPLAINTS' | 'EDIT_SHIPPING' | 'UPLOAD_DOCUMENTS' | 'VIEW_HYDROGRAPHY' | 'EDIT_DATA' | 'ADMIN_ACCESS';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  userType: UserType;
  isActive: boolean;
  isReadOnly?: boolean;
  classification?: string;
  subscribedServices?: string[];
  permissions?: Permission[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  verifySecurityCode: (code: string, userType: UserType) => Promise<boolean>;
}

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  userType: UserType;
  securityCode: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    fullName: 'رئيس مجلس الإدارة',
    email: 'Chairman@dpa.gov.eg',
    phone: '01000000000',
    password: 'Chairman123',
    userType: 'CHAIRMAN',
    isActive: true,
    isReadOnly: true,
    classification: 'رئيس',
    permissions: ['VIEW_ALL', 'VIEW_REPORTS', 'VIEW_REQUESTS', 'VIEW_COMPLAINTS', 'VIEW_HYDROGRAPHY'],
  },
  {
    id: '2',
    fullName: 'جهة خارجية – شركة شحن وتفريغ 1',
    email: 'dpa-community@dpa.gov.eg',
    phone: '01011223344',
    password: 'dpa-community123',
    userType: 'COMMUNITY',
    isActive: true,
    classification: 'شركة شحن وتفريغ',
    subscribedServices: ['تأجير مخزن', 'طلبات تراكى السفن'],
    permissions: ['VIEW_REQUESTS', 'EDIT_SHIPPING', 'UPLOAD_DOCUMENTS'],
  },
  {
    id: '3',
    fullName: 'توكيل ملاحي',
    email: 'agency@dpa.gov.eg',
    phone: '01055667788',
    password: 'agency123',
    userType: 'COMMUNITY',
    isActive: true,
    classification: 'توكيل ملاحي',
    subscribedServices: ['طلبات تراكى السفن'],
    permissions: ['UPLOAD_DOCUMENTS', 'VIEW_REQUESTS'],
  },
  {
    id: '4',
    fullName: 'مدير النظام',
    email: 'admin@dpa.gov.eg',
    phone: '01234567890',
    password: 'admin123',
    userType: 'ADMIN',
    isActive: true,
    classification: 'مدير',
    permissions: ['ADMIN_ACCESS', 'VIEW_ALL', 'EDIT_DATA'],
  },
  {
    id: '5',
    fullName: 'محمد علي',
    email: 'staff@dpa.gov.eg',
    phone: '01098765432',
    password: 'staff123',
    userType: 'DPA_STAFF',
    isActive: true,
    classification: 'موظف',
    permissions: ['VIEW_ALL', 'EDIT_DATA'],
  },
  {
    id: '6',
    fullName: 'الشركة العربية للتفريغ',
    email: 'arab-stevedore@dpa.gov.eg',
    phone: '01099887766',
    password: 'dpa123',
    userType: 'COMMUNITY',
    isActive: true,
    classification: 'شركة شحن وتفريغ',
    subscribedServices: ['تأجير مخزن'],
    permissions: ['VIEW_REQUESTS', 'EDIT_SHIPPING'],
  },
  {
    id: '7',
    fullName: 'مكتب الوفاء للتخليص',
    email: 'clearance@dpa.gov.eg',
    phone: '01122334455',
    password: 'dpa123',
    userType: 'COMMUNITY',
    isActive: true,
    classification: 'مستخلص جمركى',
    subscribedServices: ['تقديم بلاغات والشكاوى'],
    permissions: ['VIEW_COMPLAINTS', 'UPLOAD_DOCUMENTS'],
  },
  {
    id: '8',
    fullName: 'سارة خالد',
    email: 'sara@dpa.gov.eg',
    phone: '01234567890',
    password: 'staff123',
    userType: 'DPA_STAFF',
    isActive: true,
    classification: 'موظف',
    permissions: ['VIEW_ALL', 'EDIT_DATA'],
  },
];

// Mock security codes
const mockSecurityCodes = {
  STAFF_FIXED: 'DPA-STAFF-2025',
  COMMUNITY_CODES: ['COM-001-2025', 'COM-002-2025', 'COM-003-2025'],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('dpa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase().trim() && u.password === password.trim()
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('dpa_user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    }

    setIsLoading(false);
    return false;
  };

  const verifySecurityCode = async (code: string, userType: UserType): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (userType === 'DPA_STAFF' || userType === 'ADMIN') {
      return code === mockSecurityCodes.STAFF_FIXED;
    }

    return mockSecurityCodes.COMMUNITY_CODES.includes(code);
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Verify security code
    const isCodeValid = await verifySecurityCode(data.securityCode, data.userType);
    if (!isCodeValid) {
      setIsLoading(false);
      return false;
    }

    // Create new user
    const newUser: User = {
      id: String(Date.now()),
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      userType: data.userType,
      isActive: true,
    };

    setUser(newUser);
    localStorage.setItem('dpa_user', JSON.stringify(newUser));
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dpa_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        verifySecurityCode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
