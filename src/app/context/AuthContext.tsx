import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type AccountType = 'individual_donor' | 'business_donor' | 'parent' | 'student';
export type UserRole = 'super_admin' | 'admin' | 'user';

export interface StudentAccount {
  id: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  gradeLevel: string;
  dateOfBirth: string;
  parentId: string;
  parentApproved: boolean;
  avatar?: string;
  email?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  password: string;
  accountType: AccountType;
  role: UserRole;
  firstName: string;
  lastName: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  status: 'active' | 'suspended';
  // Business donor
  businessName?: string;
  businessTitle?: string;
  ein?: string;
  // Parent
  students?: StudentAccount[];
  // Student
  parentId?: string;
  dateOfBirth?: string;
  gradeLevel?: string;
  parentApproved?: boolean;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  allUsers: AuthUser[];
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  registerIndividual: (data: IndividualRegisterData) => { success: boolean; message: string };
  registerBusiness: (data: BusinessRegisterData) => { success: boolean; message: string };
  registerParent: (data: ParentRegisterData) => { success: boolean; message: string };
  registerStudent: (data: StudentRegisterData) => { success: boolean; message: string };
  addStudentToParent: (parentId: string, student: Omit<StudentAccount, 'id' | 'parentId' | 'parentApproved'>) => void;
  updateStudentPermission: (parentId: string, studentId: string, approved: boolean) => void;
  getStudentsForParent: (parentId: string) => StudentAccount[];
  updateUserRole: (userId: string, role: UserRole) => void;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => void;
  deleteUser: (userId: string) => void;
}

export interface IndividualRegisterData {
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  phone?: string;
  password: string;
}

export interface BusinessRegisterData {
  firstName: string;
  lastName: string;
  businessName: string;
  businessTitle?: string;
  ein?: string;
  email: string;
  phone?: string;
  password: string;
}

export interface ParentRegisterData {
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  phone?: string;
  password: string;
}

export interface StudentRegisterData {
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  gradeLevel: string;
  dateOfBirth: string;
  parentEmail?: string;
  password: string;
}

const STORAGE_KEY = 'act_users';
const SESSION_KEY = 'act_current_user_id';

// Seed super admin account
const SEED_SUPER_ADMIN: AuthUser = {
  id: 'super_admin_1',
  email: 'admin@arizonachristiantuition.com',
  password: 'ACTAdmin2026!',
  accountType: 'individual_donor',
  role: 'super_admin',
  firstName: 'ACT',
  lastName: 'Administrator',
  avatar: 'https://i.pravatar.cc/150?u=superadmin',
  createdAt: '2025-01-01T00:00:00.000Z',
  status: 'active',
};

function loadUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const users: AuthUser[] = raw ? JSON.parse(raw) : [];
    // Always ensure seed super admin exists
    if (!users.find(u => u.id === SEED_SUPER_ADMIN.id)) {
      return [SEED_SUPER_ADMIN, ...users];
    }
    return users;
  } catch {
    return [SEED_SUPER_ADMIN];
  }
}

function saveUsers(users: AuthUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [allUsers, setAllUsers] = useState<AuthUser[]>(() => loadUsers());
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    () => sessionStorage.getItem(SESSION_KEY)
  );

  const currentUser = currentUserId ? allUsers.find(u => u.id === currentUserId) ?? null : null;
  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  useEffect(() => {
    saveUsers(allUsers);
  }, [allUsers]);

  useEffect(() => {
    if (currentUserId) sessionStorage.setItem(SESSION_KEY, currentUserId);
    else sessionStorage.removeItem(SESSION_KEY);
  }, [currentUserId]);

  const login = (email: string, password: string) => {
    const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) return { success: false, message: 'Invalid email or password.' };
    setCurrentUserId(user.id);
    return { success: true, message: 'Welcome back!' };
  };

  const logout = () => setCurrentUserId(null);

  const emailExists = (email: string) =>
    allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());

  const registerIndividual = (data: IndividualRegisterData) => {
    if (emailExists(data.email)) return { success: false, message: 'An account with this email already exists.' };
    const user: AuthUser = {
      id: `ind_${Date.now()}`,
      accountType: 'individual_donor',
      role: 'user',
      status: 'active',
      firstName: data.firstName,
      lastName: data.lastName,
      nickname: data.nickname,
      email: data.email,
      phone: data.phone,
      password: data.password,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
      createdAt: new Date().toISOString(),
    };
    setAllUsers(prev => [...prev, user]);
    setCurrentUserId(user.id);
    return { success: true, message: 'Account created!' };
  };

  const registerBusiness = (data: BusinessRegisterData) => {
    if (emailExists(data.email)) return { success: false, message: 'An account with this email already exists.' };
    const user: AuthUser = {
      id: `biz_${Date.now()}`,
      accountType: 'business_donor',
      role: 'user',
      status: 'active',
      firstName: data.firstName,
      lastName: data.lastName,
      businessName: data.businessName,
      businessTitle: data.businessTitle,
      ein: data.ein,
      email: data.email,
      phone: data.phone,
      password: data.password,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
      createdAt: new Date().toISOString(),
    };
    setAllUsers(prev => [...prev, user]);
    setCurrentUserId(user.id);
    return { success: true, message: 'Business account created!' };
  };

  const registerParent = (data: ParentRegisterData) => {
    if (emailExists(data.email)) return { success: false, message: 'An account with this email already exists.' };
    const user: AuthUser = {
      id: `par_${Date.now()}`,
      accountType: 'parent',
      role: 'user',
      status: 'active',
      firstName: data.firstName,
      lastName: data.lastName,
      nickname: data.nickname,
      email: data.email,
      phone: data.phone,
      password: data.password,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
      students: [],
      createdAt: new Date().toISOString(),
    };
    setAllUsers(prev => [...prev, user]);
    setCurrentUserId(user.id);
    return { success: true, message: 'Parent account created!' };
  };

  const registerStudent = (data: StudentRegisterData) => {
    if (emailExists(data.email)) return { success: false, message: 'An account with this email already exists.' };
    const parent = data.parentEmail
      ? allUsers.find(u => u.email.toLowerCase() === data.parentEmail!.toLowerCase() && u.accountType === 'parent')
      : null;
    const user: AuthUser = {
      id: `stu_${Date.now()}`,
      accountType: 'student',
      role: 'user',
      status: 'active',
      firstName: data.firstName,
      lastName: data.lastName,
      nickname: data.nickname,
      email: data.email,
      gradeLevel: data.gradeLevel,
      dateOfBirth: data.dateOfBirth,
      parentId: parent?.id,
      parentApproved: false,
      password: data.password,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
      createdAt: new Date().toISOString(),
    };
    setAllUsers(prev => {
      const updated = [...prev, user];
      // Also link to parent's students list
      if (parent) {
        return updated.map(u => {
          if (u.id === parent.id) {
            const student: StudentAccount = {
              id: user.id,
              firstName: data.firstName,
              lastName: data.lastName,
              nickname: data.nickname,
              gradeLevel: data.gradeLevel,
              dateOfBirth: data.dateOfBirth,
              parentId: parent.id,
              parentApproved: false,
              email: data.email,
            };
            return { ...u, students: [...(u.students || []), student] };
          }
          return u;
        });
      }
      return updated;
    });
    setCurrentUserId(user.id);
    return { success: true, message: 'Student account created!' };
  };

  const addStudentToParent = (
    parentId: string,
    studentData: Omit<StudentAccount, 'id' | 'parentId' | 'parentApproved'>
  ) => {
    const newStudent: StudentAccount = {
      ...studentData,
      id: `stu_${Date.now()}`,
      parentId,
      parentApproved: true,
    };
    setAllUsers(prev =>
      prev.map(u =>
        u.id === parentId
          ? { ...u, students: [...(u.students || []), newStudent] }
          : u
      )
    );
  };

  const updateStudentPermission = (parentId: string, studentId: string, approved: boolean) => {
    setAllUsers(prev =>
      prev.map(u => {
        if (u.id === parentId) {
          return {
            ...u,
            students: u.students?.map(s =>
              s.id === studentId ? { ...s, parentApproved: approved } : s
            ),
          };
        }
        if (u.id === studentId) return { ...u, parentApproved: approved };
        return u;
      })
    );
  };

  const getStudentsForParent = (parentId: string): StudentAccount[] => {
    const parent = allUsers.find(u => u.id === parentId);
    return parent?.students || [];
  };

  const updateUserRole = (userId: string, role: UserRole) => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  };

  const updateUserStatus = (userId: string, status: 'active' | 'suspended') => {
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
  };

  const deleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated: !!currentUser,
        isSuperAdmin,
        isAdmin,
        login,
        logout,
        registerIndividual,
        registerBusiness,
        registerParent,
        registerStudent,
        addStudentToParent,
        updateStudentPermission,
        getStudentsForParent,
        updateUserRole,
        updateUserStatus,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}