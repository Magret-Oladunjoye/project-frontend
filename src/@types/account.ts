// ----------------------------------------------------------------------

export type Project = {
  id: string;
  project_name: string,
  project_size: string,
  project_start_date: Date,
  project_end_date: Date,
  working_employees: string
  Manager: string,
  displayName: string;
  email: string;
  password: string;
  photoURL: File | any;
  phoneNumber: string | null;
  country: string | null;
  address: string | null;
  state: string | null;
  city: string | null;
  zipCode: string | null;
  about: string | null;
  role: string;
  isPublic: boolean;
};
