import { create } from 'zustand';
import type { TeamResponse, UserResponse } from '@/types/api';

interface TeamState {
  myTeam: TeamResponse | null;
  allTeams: TeamResponse[];
  availableUsers: UserResponse[];
  isLoading: boolean;
  
  // Actions
  setMyTeam: (team: TeamResponse | null) => void;
  setAllTeams: (teams: TeamResponse[]) => void;
  setAvailableUsers: (users: UserResponse[]) => void;
  setLoading: (loading: boolean) => void;
  clearTeamData: () => void;
}

export const useTeamStore = create<TeamState>((set) => ({
  myTeam: null,
  allTeams: [],
  availableUsers: [],
  isLoading: false,

  setMyTeam: (myTeam) => set({ myTeam }),
  
  setAllTeams: (allTeams) => set({ allTeams }),
  
  setAvailableUsers: (availableUsers) => set({ availableUsers }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  clearTeamData: () => set({ 
    myTeam: null, 
    allTeams: [], 
    availableUsers: [] 
  })
})); 