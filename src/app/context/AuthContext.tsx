import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { dbProfileToAuthUser, authUserToProfileInsert, dbStudentToStudentAccount } from '../../lib/mappers';
import type { DbProfile, DbStudent } from '../../lib/database.types';

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
  accountType: AccountType;
  role: UserRole;
  firstName: string;
  lastName: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  status: 'active' | 'suspended';
  bio?: string;
  location?: string;
  schoolName?: string;
  businessName?: string;
  businessTitle?: string;
  ein?: string;
  students?: StudentAccount[];
  parentId?: string;
  dateOfBirth?: string;
  gradeLevel?: string;
  parentApproved?: boolean;
}

type AuthResult = Promise<{ success: boolean; message: string }>;

interface AuthContextType {
  currentUser: AuthUser | null;
  allUsers: AuthUser[];
  isAuthenticated: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (email: string, password: string) => AuthResult;
  logout: () => Promise<void>;
  registerIndividual: (data: IndividualRegisterData) => AuthResult;
  registerBusiness: (data: BusinessRegisterData) => AuthResult;
  registerParent: (data: ParentRegisterData) => AuthResult;
  registerStudent: (data: StudentRegisterData) => AuthResult;
  addStudentToParent: (parentId: string, student: Omit<StudentAccount, 'id' | 'parentId' | 'parentApproved'>) => Promise<void>;
  updateStudentPermission: (parentId: string, studentId: string, approved: boolean) => Promise<void>;
  getStudentsForParent: (parentId: string) => StudentAccount[];
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserProfile: (userId: string, updates: Partial<AuthUser>) => Promise<void>;
  updateStudent: (parentId: string, studentId: string, updates: Partial<StudentAccount>) => Promise<void>;
  deleteStudent: (parentId: string, studentId: string) => Promise<void>;
  refreshCurrentUser: () => Promise<void>;
  fetchAllUsers: () => Promise<void>;
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

const AuthContext = createContext<AuthContextType | null>(null);

// Helper: fetch a profile + its students from Supabase
async function fetchProfileWithStudents(userId: string): Promise<AuthUser | null> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error || !profile) return null;

  let students: StudentAccount[] | undefined;
  if ((profile as DbProfile).account_type === 'parent') {
    const { data: stuRows } = await supabase
      .from('students')
      .select('*')
      .eq('parent_id', userId);
    if (stuRows) {
      students = (stuRows as DbStudent[]).map(dbStudentToStudentAccount);
    }
  }

  return dbProfileToAuthUser(profile as DbProfile, students);
}

// Helper: fire-and-forget email call
function sendEmail(endpoint: string, body: Record<string, unknown>) {
  const baseUrl = import.meta.env.VITE_SUPABASE_FUNCTIONS_URL || '';
  if (!baseUrl) return;
  fetch(`${baseUrl}/email/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {});
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);

  const isSuperAdmin = currentUser?.role === 'super_admin';
  const isAdmin = currentUser?.role === 'super_admin' || currentUser?.role === 'admin';

  // ── Refresh current user from DB ─────────────────────────────────────────
  const refreshCurrentUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      setCurrentUser(null);
      return;
    }
    const user = await fetchProfileWithStudents(session.user.id);
    setCurrentUser(user);
  }, []);

  // ── Fetch all users (admin use) ──────────────────────────────────────────
  const fetchAllUsers = useCallback(async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (data) {
      setAllUsers((data as DbProfile[]).map(p => dbProfileToAuthUser(p)));
    }
  }, []);

  // ── Session bootstrap + auth state listener ──────────────────────────────
  useEffect(() => {
    let mounted = true;

    // Hard timeout: never show spinner for more than 5 seconds
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    async function init() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && mounted) {
          const user = await fetchProfileWithStudents(session.user.id);
          if (mounted) setCurrentUser(user);
        }
      } catch {
        // swallow errors so loading never stays stuck
      } finally {
        clearTimeout(timeout);
        if (mounted) setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const user = await fetchProfileWithStudents(session.user.id);
        if (mounted) setCurrentUser(user);
      } else {
        if (mounted) setCurrentUser(null);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true, message: 'Welcome back!' };
  };

  // ── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
  };

  // ── Register helpers ─────────────────────────────────────────────────────
  async function signUpAndCreateProfile(
    email: string,
    password: string,
    profileData: Parameters<typeof authUserToProfileInsert>[0]
  ): Promise<{ success: boolean; message: string }> {
    // Pass profile data as user metadata — a DB trigger creates the profile row,
    // bypassing PostgREST schema cache issues entirely.
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_type: profileData.accountType,
          first_name: profileData.firstName,
          last_name: profileData.lastName,
          nickname: profileData.nickname ?? null,
          phone: profileData.phone ?? null,
          location: profileData.location ?? null,
          school_name: profileData.schoolName ?? null,
          business_name: profileData.businessName ?? null,
          business_title: profileData.businessTitle ?? null,
          ein: profileData.ein ?? null,
          date_of_birth: profileData.dateOfBirth ?? null,
          grade_level: profileData.gradeLevel ?? null,
        },
      },
    });
    if (signUpError) return { success: false, message: signUpError.message };
    if (!authData.user) return { success: false, message: 'Registration failed. Please try again.' };

    // Fire welcome email (non-blocking)
    sendEmail('welcome', { firstName: profileData.firstName, lastName: profileData.lastName, email, accountType: profileData.accountType });

    return { success: true, message: 'Account created!' };
  }

  const registerIndividual = async (data: IndividualRegisterData) => {
    return signUpAndCreateProfile(data.email, data.password, {
      id: '', // placeholder, replaced in helper
      email: data.email,
      accountType: 'individual_donor',
      firstName: data.firstName,
      lastName: data.lastName,
      nickname: data.nickname,
      phone: data.phone,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
    });
  };

  const registerBusiness = async (data: BusinessRegisterData) => {
    return signUpAndCreateProfile(data.email, data.password, {
      id: '',
      email: data.email,
      accountType: 'business_donor',
      firstName: data.firstName,
      lastName: data.lastName,
      businessName: data.businessName,
      businessTitle: data.businessTitle,
      ein: data.ein,
      phone: data.phone,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
    });
  };

  const registerParent = async (data: ParentRegisterData) => {
    return signUpAndCreateProfile(data.email, data.password, {
      id: '',
      email: data.email,
      accountType: 'parent',
      firstName: data.firstName,
      lastName: data.lastName,
      nickname: data.nickname,
      phone: data.phone,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
    });
  };

  const registerStudent = async (data: StudentRegisterData) => {
    const result = await signUpAndCreateProfile(data.email, data.password, {
      id: '',
      email: data.email,
      accountType: 'student',
      firstName: data.firstName,
      lastName: data.lastName,
      nickname: data.nickname,
      gradeLevel: data.gradeLevel,
      dateOfBirth: data.dateOfBirth,
      avatar: `https://i.pravatar.cc/150?u=${data.email}`,
    });

    // If parentEmail provided, trigger parent-approval email
    if (result.success && data.parentEmail) {
      sendEmail('parent-approval', {
        studentFirstName: data.firstName,
        studentLastName: data.lastName,
        studentEmail: data.email,
        parentEmail: data.parentEmail,
      });
    }

    return result;
  };

  // ── Student operations ───────────────────────────────────────────────────
  const addStudentToParent = async (
    parentId: string,
    studentData: Omit<StudentAccount, 'id' | 'parentId' | 'parentApproved'>
  ) => {
    const { error } = await supabase.from('students').insert({
      parent_id: parentId,
      first_name: studentData.firstName,
      last_name: studentData.lastName,
      nickname: studentData.nickname ?? null,
      grade_level: studentData.gradeLevel || 'Unknown',
      date_of_birth: studentData.dateOfBirth || null,
      parent_approved: true,
      avatar: studentData.avatar ?? null,
      email: studentData.email ?? null,
    });
    if (!error) await refreshCurrentUser();
  };

  const updateStudentPermission = async (_parentId: string, studentId: string, approved: boolean) => {
    await supabase.from('students').update({ parent_approved: approved }).eq('id', studentId);
    await refreshCurrentUser();
  };

  const getStudentsForParent = (parentId: string): StudentAccount[] => {
    if (currentUser?.id === parentId) return currentUser?.students || [];
    return [];
  };

  // ── Admin operations ─────────────────────────────────────────────────────
  const updateUserRole = async (userId: string, role: UserRole) => {
    await supabase.from('profiles').update({ role }).eq('id', userId);
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
    if (currentUser?.id === userId) await refreshCurrentUser();
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'suspended') => {
    await supabase.from('profiles').update({ status }).eq('id', userId);
    setAllUsers(prev => prev.map(u => u.id === userId ? { ...u, status } : u));
    if (currentUser?.id === userId) await refreshCurrentUser();
  };

  const deleteUser = async (userId: string) => {
    // Delete profile (cascades to students). Auth user deletion requires service-role.
    await supabase.from('profiles').delete().eq('id', userId);
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateUserProfile = async (userId: string, updates: Partial<AuthUser>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
    if (updates.nickname !== undefined) dbUpdates.nickname = updates.nickname || null;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone || null;
    if (updates.bio !== undefined) dbUpdates.bio = updates.bio || null;
    if (updates.location !== undefined) dbUpdates.location = updates.location || null;
    if (updates.schoolName !== undefined) dbUpdates.school_name = updates.schoolName || null;
    if (updates.businessName !== undefined) dbUpdates.business_name = updates.businessName || null;
    if (updates.businessTitle !== undefined) dbUpdates.business_title = updates.businessTitle || null;
    if (updates.avatar !== undefined) dbUpdates.avatar = updates.avatar || null;

    await supabase.from('profiles').update(dbUpdates).eq('id', userId);
    if (currentUser?.id === userId) await refreshCurrentUser();
  };

  const updateStudent = async (_parentId: string, studentId: string, updates: Partial<StudentAccount>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.firstName !== undefined) dbUpdates.first_name = updates.firstName;
    if (updates.lastName !== undefined) dbUpdates.last_name = updates.lastName;
    if (updates.nickname !== undefined) dbUpdates.nickname = updates.nickname || null;
    if (updates.gradeLevel !== undefined) dbUpdates.grade_level = updates.gradeLevel;
    if (updates.dateOfBirth !== undefined) dbUpdates.date_of_birth = updates.dateOfBirth || null;

    await supabase.from('students').update(dbUpdates).eq('id', studentId);
    await refreshCurrentUser();
  };

  const deleteStudent = async (_parentId: string, studentId: string) => {
    await supabase.from('students').delete().eq('id', studentId);
    await refreshCurrentUser();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        isAuthenticated: !!currentUser,
        isSuperAdmin,
        isAdmin,
        loading,
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
        updateUserProfile,
        updateStudent,
        deleteStudent,
        refreshCurrentUser,
        fetchAllUsers,
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
