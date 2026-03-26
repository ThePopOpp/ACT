import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CAMPAIGNS, MOCK_PLEDGES, MOCK_USER, Campaign, PledgeTier } from '../data/mockData';

interface Pledge {
  campaignId: string;
  tierId: string;
  amount: number;
  date: string;
  status: 'confirmed';
}

interface AppContextType {
  campaigns: Campaign[];
  pledges: Pledge[];
  user: typeof MOCK_USER;
  makePledge: (campaignId: string, tier: PledgeTier) => void;
  addCampaign: (campaign: Campaign) => void;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (campaignId: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS);
  const [pledges, setPledges] = useState<Pledge[]>(MOCK_PLEDGES);

  const makePledge = (campaignId: string, tier: PledgeTier) => {
    setPledges(prev => [
      ...prev,
      {
        campaignId,
        tierId: tier.id,
        amount: tier.amount,
        date: new Date().toISOString().split('T')[0],
        status: 'confirmed',
      },
    ]);
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId
          ? { ...c, raised: c.raised + tier.amount, backers: c.backers + 1 }
          : c,
      ),
    );
  };

  const addCampaign = (campaign: Campaign) => {
    setCampaigns(prev => [campaign, ...prev]);
  };

  const updateCampaign = (campaignId: string, updates: Partial<Campaign>) => {
    setCampaigns(prev =>
      prev.map(c =>
        c.id === campaignId ? { ...c, ...updates } : c
      )
    );
  };

  const deleteCampaign = (campaignId: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== campaignId));
  };

  return (
    <AppContext.Provider value={{ campaigns, pledges, user: MOCK_USER, makePledge, addCampaign, updateCampaign, deleteCampaign }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
