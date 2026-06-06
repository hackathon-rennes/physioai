import { create } from 'zustand';

export type Patient = {
  id: string;
  maiaId: string;
  firstName: string;
  lastName: string;
  email: string;
  nextAppointment: string;
};

interface PatientStore {
  patients: Patient[];
  selectedPatient: Patient | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectPatient: (patient: Patient | null) => void;
}

export const usePatientStore = create<PatientStore>((set) => ({
  // Mock data simulant les patients importés depuis Maia
  patients: [
    { id: '1', maiaId: 'MAIA-001', firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@email.com', nextAppointment: '2026-06-08T10:00:00Z' },
    { id: '2', maiaId: 'MAIA-002', firstName: 'Marie', lastName: 'Durand', email: 'marie.durand@email.com', nextAppointment: '2026-06-09T14:30:00Z' },
    { id: '3', maiaId: 'MAIA-003', firstName: 'Paul', lastName: 'Martin', email: 'paul.martin@email.com', nextAppointment: '2026-06-10T09:00:00Z' },
  ],
  selectedPatient: null,
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  selectPatient: (patient) => set({ selectedPatient: patient }),
}));
