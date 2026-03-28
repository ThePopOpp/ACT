// TypeScript interfaces mirroring the Supabase DB schema (snake_case)

export interface DbProfile {
  id: string;
  email: string;
  account_type: 'individual_donor' | 'business_donor' | 'parent' | 'student';
  role: 'super_admin' | 'admin' | 'user';
  first_name: string;
  last_name: string;
  nickname: string | null;
  phone: string | null;
  avatar: string | null;
  status: 'active' | 'suspended';
  bio: string | null;
  location: string | null;
  school_name: string | null;
  business_name: string | null;
  business_title: string | null;
  ein: string | null;
  parent_id: string | null;
  date_of_birth: string | null;
  grade_level: string | null;
  parent_approved: boolean | null;
  created_at: string;
}

export interface DbStudent {
  id: string;
  parent_id: string;
  first_name: string;
  last_name: string;
  nickname: string | null;
  grade_level: string;
  date_of_birth: string | null;
  parent_approved: boolean;
  avatar: string | null;
  email: string | null;
  auth_user_id: string | null;
  created_at: string;
}

export interface DbCampaign {
  id: string;
  title: string;
  tagline: string;
  story: string;
  category: string;
  goal: number;
  raised: number;
  backers: number;
  days_left: number;
  image: string | null;
  status: 'active' | 'funded' | 'ending_soon';
  featured: boolean;
  tags: string[];
  creator: {
    id: string;
    name: string;
    avatar: string;
    bio: string;
    campaignsCreated: number;
    location: string;
  };
  pledge_tiers: {
    id: string;
    title: string;
    amount: number;
    description: string;
    perks: string[];
    claimed: number;
    limit?: number;
    eta: string;
  }[];
  updates: {
    id: string;
    date: string;
    title: string;
    content: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  creator_profile_id: string | null;
  student_id: string | null;
  school: {
    name?: string;
    website?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    logo?: string;
  };
  created_at: string;
}

export interface DbPledge {
  id: string;
  campaign_id: string;
  donor_id: string | null;
  tier_id: string | null;
  amount: number;
  status: string;
  payment_method: string | null;
  paypal_transaction_id: string | null;
  paypal_order_id: string | null;
  payer_email: string | null;
  donor_info: Record<string, unknown> | null;
  tax_info: Record<string, unknown> | null;
  created_at: string;
}
