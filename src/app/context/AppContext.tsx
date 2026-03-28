import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../../lib/supabase';
import { dbCampaignToCampaign, campaignToDbInsert, dbPledgeToFrontendPledge } from '../../lib/mappers';
import type { DbCampaign, DbPledge } from '../../lib/database.types';
import type { Campaign, PledgeTier } from '../data/mockData';
import { useAuth } from './AuthContext';

export interface PaymentMetadata {
  paypalTransactionId?: string;
  paypalOrderId?: string;
  paymentMethod?: 'paypal' | 'mock';
  payerEmail?: string;
}

export interface Pledge {
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

interface AppContextType {
  campaigns: Campaign[];
  pledges: Pledge[];
  campaignsLoading: boolean;
  pledgesLoading: boolean;
  makePledge: (campaignId: string, tier: PledgeTier, payment?: PaymentMetadata, donorInfo?: Record<string, unknown>, taxInfo?: Record<string, unknown>) => Promise<void>;
  addCampaign: (campaign: Campaign) => Promise<void>;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  refreshCampaigns: () => Promise<void>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [campaignsLoading, setCampaignsLoading] = useState(true);
  const [pledgesLoading, setPledgesLoading] = useState(false);

  // ── Load campaigns from Supabase on mount ────────────────────────────────
  const refreshCampaigns = useCallback(async () => {
    setCampaignsLoading(true);
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) {
      setCampaigns((data as DbCampaign[]).map(dbCampaignToCampaign));
    }
    setCampaignsLoading(false);
  }, []);

  useEffect(() => {
    refreshCampaigns();
  }, [refreshCampaigns]);

  // ── Load user's pledges when auth changes ────────────────────────────────
  useEffect(() => {
    if (!currentUser) {
      setPledges([]);
      return;
    }
    setPledgesLoading(true);
    supabase
      .from('pledges')
      .select('*')
      .eq('donor_id', currentUser.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) {
          setPledges((data as DbPledge[]).map(dbPledgeToFrontendPledge));
        }
        setPledgesLoading(false);
      });
  }, [currentUser?.id]);

  // ── Make a pledge (calls DB function for atomicity) ──────────────────────
  const makePledge = async (
    campaignId: string,
    tier: PledgeTier,
    payment?: PaymentMetadata,
    donorInfo?: Record<string, unknown>,
    taxInfo?: Record<string, unknown>
  ) => {
    const { error } = await supabase.rpc('make_pledge', {
      p_campaign_id: campaignId,
      p_donor_id: currentUser?.id ?? null,
      p_tier_id: tier.id,
      p_amount: tier.amount,
      p_payment_method: payment?.paymentMethod ?? null,
      p_paypal_transaction_id: payment?.paypalTransactionId ?? null,
      p_paypal_order_id: payment?.paypalOrderId ?? null,
      p_payer_email: payment?.payerEmail ?? null,
      p_donor_info: donorInfo ?? null,
      p_tax_info: taxInfo ?? null,
    });

    if (error) {
      console.error('makePledge error:', error);
    }

    // Optimistically update local state, then refresh from DB
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? { ...c, raised: c.raised + tier.amount, backers: c.backers + 1 }
          : c,
      ),
    );
    setPledges(prev => [
      {
        campaignId,
        tierId: tier.id,
        amount: tier.amount,
        date: new Date().toISOString().split('T')[0],
        status: 'confirmed',
        ...payment,
      },
      ...prev,
    ]);

    // Background refresh for accurate data
    refreshCampaigns();
  };

  // ── Campaign CRUD ────────────────────────────────────────────────────────
  const addCampaign = async (campaign: Campaign) => {
    const row = campaignToDbInsert(campaign);
    if (currentUser) {
      (row as Record<string, unknown>).creator_profile_id = currentUser.id;
    }
    const { error } = await supabase.from('campaigns').insert(row);
    if (!error) {
      await refreshCampaigns();
    }
  };

  const updateCampaign = async (campaignId: string, updates: Partial<Campaign>) => {
    const dbUpdates: Record<string, unknown> = {};
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.tagline !== undefined) dbUpdates.tagline = updates.tagline;
    if (updates.story !== undefined) dbUpdates.story = updates.story;
    if (updates.category !== undefined) dbUpdates.category = updates.category;
    if (updates.goal !== undefined) dbUpdates.goal = updates.goal;
    if (updates.image !== undefined) dbUpdates.image = updates.image;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
    if (updates.tags !== undefined) dbUpdates.tags = updates.tags;
    if (updates.pledgeTiers !== undefined) dbUpdates.pledge_tiers = updates.pledgeTiers;
    if (updates.updates !== undefined) dbUpdates.updates = updates.updates;
    if (updates.faqs !== undefined) dbUpdates.faqs = updates.faqs;
    if (updates.studentId !== undefined) dbUpdates.student_id = updates.studentId || null;
    if (updates.school !== undefined) dbUpdates.school = updates.school;

    await supabase.from('campaigns').update(dbUpdates).eq('id', campaignId);
    // Optimistic update then refresh
    setCampaigns(prev => prev.map(c => c.id === campaignId ? { ...c, ...updates } : c));
    refreshCampaigns();
  };

  const deleteCampaign = async (campaignId: string) => {
    await supabase.from('campaigns').delete().eq('id', campaignId);
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
  };

  return (
    <AppContext.Provider
      value={{
        campaigns,
        pledges,
        campaignsLoading,
        pledgesLoading,
        makePledge,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        refreshCampaigns,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
