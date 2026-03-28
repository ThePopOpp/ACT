// Convert between DB snake_case shapes and frontend camelCase shapes
import type { DbProfile, DbStudent, DbCampaign, DbPledge } from './database.types';
import type { AuthUser, StudentAccount, AccountType, UserRole } from '../app/context/AuthContext';
import type { Campaign, PledgeTier } from '../app/data/mockData';

// ─── Profile ↔ AuthUser ────────────────────────────────────────────────────────

export function dbProfileToAuthUser(p: DbProfile, students?: StudentAccount[]): AuthUser {
  return {
    id: p.id,
    email: p.email,
    accountType: p.account_type as AccountType,
    role: p.role as UserRole,
    firstName: p.first_name,
    lastName: p.last_name,
    nickname: p.nickname ?? undefined,
    phone: p.phone ?? undefined,
    avatar: p.avatar ?? undefined,
    createdAt: p.created_at,
    status: p.status,
    bio: p.bio ?? undefined,
    location: p.location ?? undefined,
    schoolName: p.school_name ?? undefined,
    businessName: p.business_name ?? undefined,
    businessTitle: p.business_title ?? undefined,
    ein: p.ein ?? undefined,
    parentId: p.parent_id ?? undefined,
    dateOfBirth: p.date_of_birth ?? undefined,
    gradeLevel: p.grade_level ?? undefined,
    parentApproved: p.parent_approved ?? undefined,
    students: students,
  };
}

export function authUserToProfileInsert(u: {
  id: string;
  email: string;
  accountType: AccountType;
  firstName: string;
  lastName: string;
  nickname?: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  schoolName?: string;
  businessName?: string;
  businessTitle?: string;
  ein?: string;
  parentId?: string;
  dateOfBirth?: string;
  gradeLevel?: string;
  parentApproved?: boolean;
}): Partial<DbProfile> {
  return {
    id: u.id,
    email: u.email,
    account_type: u.accountType,
    role: 'user',
    first_name: u.firstName,
    last_name: u.lastName,
    nickname: u.nickname ?? null,
    phone: u.phone ?? null,
    avatar: u.avatar ?? null,
    status: 'active',
    bio: u.bio ?? null,
    location: u.location ?? null,
    school_name: u.schoolName ?? null,
    business_name: u.businessName ?? null,
    business_title: u.businessTitle ?? null,
    ein: u.ein ?? null,
    parent_id: u.parentId ?? null,
    date_of_birth: u.dateOfBirth ?? null,
    grade_level: u.gradeLevel ?? null,
    parent_approved: u.parentApproved ?? null,
  };
}

// ─── Student ↔ StudentAccount ──────────────────────────────────────────────────

export function dbStudentToStudentAccount(s: DbStudent): StudentAccount {
  return {
    id: s.id,
    firstName: s.first_name,
    lastName: s.last_name,
    nickname: s.nickname ?? undefined,
    gradeLevel: s.grade_level,
    dateOfBirth: s.date_of_birth ?? '',
    parentId: s.parent_id,
    parentApproved: s.parent_approved,
    avatar: s.avatar ?? undefined,
    email: s.email ?? undefined,
  };
}

// ─── Campaign ↔ Campaign ──────────────────────────────────────────────────────

export function dbCampaignToCampaign(c: DbCampaign): Campaign {
  return {
    id: c.id,
    title: c.title,
    tagline: c.tagline,
    story: c.story,
    category: c.category,
    goal: Number(c.goal),
    raised: Number(c.raised),
    backers: c.backers,
    daysLeft: c.days_left,
    image: c.image ?? '',
    tags: c.tags ?? [],
    featured: c.featured,
    status: c.status,
    createdAt: c.created_at?.split('T')[0] ?? '',
    creator: c.creator ?? { id: '', name: '', avatar: '', bio: '', campaignsCreated: 0, location: '' },
    pledgeTiers: (c.pledge_tiers ?? []) as PledgeTier[],
    updates: c.updates ?? [],
    faqs: c.faqs ?? [],
    studentId: c.student_id ?? undefined,
    school: c.school ?? {},
  };
}

export function campaignToDbInsert(c: Campaign): Partial<DbCampaign> {
  return {
    title: c.title,
    tagline: c.tagline,
    story: c.story,
    category: c.category,
    goal: c.goal,
    raised: c.raised,
    backers: c.backers,
    days_left: c.daysLeft,
    image: c.image,
    status: c.status,
    featured: c.featured,
    tags: c.tags,
    creator: c.creator,
    pledge_tiers: c.pledgeTiers as DbCampaign['pledge_tiers'],
    updates: c.updates,
    faqs: c.faqs,
    student_id: c.studentId ?? null,
    school: c.school ?? {},
  };
}

// ─── Pledge ────────────────────────────────────────────────────────────────────

export interface FrontendPledge {
  id?: string;
  campaignId: string;
  tierId: string;
  amount: number;
  date: string;
  status: 'confirmed';
  paypalTransactionId?: string;
  paypalOrderId?: string;
  paymentMethod?: 'paypal' | 'mock';
  payerEmail?: string;
}

export function dbPledgeToFrontendPledge(p: DbPledge): FrontendPledge {
  return {
    id: p.id,
    campaignId: p.campaign_id,
    tierId: p.tier_id ?? '',
    amount: Number(p.amount),
    date: p.created_at?.split('T')[0] ?? '',
    status: 'confirmed',
    paypalTransactionId: p.paypal_transaction_id ?? undefined,
    paypalOrderId: p.paypal_order_id ?? undefined,
    paymentMethod: (p.payment_method as 'paypal' | 'mock') ?? undefined,
    payerEmail: p.payer_email ?? undefined,
  };
}
