import { User, Santri, Announcement, Attendance, Evaluation } from '../types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Admin TPQ', phone: '08111', password: 'password', role: 'admin' },
  { id: 'u2', name: 'Ust. Ahmad', phone: '08222', password: 'password', role: 'ustadz' },
  { id: 'u3', name: 'Ust. Fatimah', phone: '08333', password: 'password', role: 'ustadz' },
  { id: 'u4', name: 'Bpk. Budi (Wali)', phone: '08444', password: 'password', role: 'wali_santri' },
];

export const mockSantri: Santri[] = [
  {
    id: 's1',
    nis: '2023001',
    name: 'Aisyah Putri',
    gender: 'P',
    birthPlace: 'Jakarta',
    birthDate: '2015-05-12',
    address: 'Jl. Melati No. 10',
    fatherName: 'Budi Santoso',
    motherName: 'Siti Aminah',
    parentPhone: '08444',
    classLevel: 'Jilid 1',
    isActive: true,
    ustadzId: 'u3',
  },
  {
    id: 's2',
    nis: '2023002',
    name: 'Muhammad Ali',
    gender: 'L',
    birthPlace: 'Bandung',
    birthDate: '2014-08-20',
    address: 'Jl. Mawar No. 5',
    fatherName: 'Ridwan',
    motherName: 'Nurul',
    parentPhone: '08555',
    classLevel: 'Jilid 3',
    isActive: true,
    ustadzId: 'u2',
  }
];

export const mockAnnouncements: Announcement[] = [
  {
    id: 'a1',
    title: 'Libur Awal Ramadhan',
    content: 'Diberitahukan kepada seluruh ustadz dan wali santri bahwa kegiatan belajar mengajar diliburkan pada 1-3 Ramadhan.',
    date: '2024-03-01',
    authorId: 'u1',
    targetRole: 'all',
  }
];

export const mockAttendance: Attendance[] = [];
export const mockEvaluations: Evaluation[] = [];
