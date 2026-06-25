export type Role = 'admin' | 'ustadz' | 'wali_santri';

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string;
  role: Role;
  gender?: 'L' | 'P';
  birthPlace?: string;
  birthDate?: string;
  address?: string;
  classLevel?: ClassLevel;
  isActive?: boolean;
}

export type ClassLevel = 
  | 'Jilid 1' | 'Jilid 2' | 'Jilid 3' | 'Jilid 4' | 'Jilid 5' 
  | "Al Qur'an 1" | "Al Qur'an 2";

export interface Santri {
  id: string;
  nis: string;
  name: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  address: string;
  fatherName: string;
  motherName: string;
  parentPhone: string;
  classLevel: ClassLevel;
  isActive: boolean;
  ustadzId?: string; // Assigned Ustadz
}

export type AttendanceStatus = 'Hadir' | 'Izin' | 'Sakit' | 'Alpha';

export interface Attendance {
  id: string;
  santriId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  notes?: string;
}

export interface Evaluation {
  id: string;
  santriId: string;
  ustadzId: string;
  date: string;
  category: string; // e.g., 'Tahsin', 'Hafalan Doa', 'Hafalan Surat'
  subject: string; // e.g., 'Doa Sebelum Tidur', 'Mengenal Huruf Fathah'
  score: 'A' | 'B' | 'C' | 'D'; // or numeric
  notes?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  authorId: string;
  targetRole?: Role | 'all';
}
