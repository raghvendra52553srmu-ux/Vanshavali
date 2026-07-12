export interface FamilyMember {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  dateOfDeath?: string;
  isAlive: boolean;
  photo: string;
  occupation: string;
  city: string;
  state: string;
  country: string;
  bio: string;
  achievements: string[];
  hobbies: string[];
  education: string;
  email?: string;
  phone?: string;
  // Relationships
  parentIds: string[];
  spouseId?: string;
  childrenIds: string[];
  // Tree position
  generation: number;
}

export interface FamilyTree {
  id: string;
  familyName: string;
  motto: string;
  origin: string;
  established: string;
  members: FamilyMember[];
  totalGenerations: number;
}

export interface TimelineEvent {
  id: string;
  date: string;
  year: number;
  title: string;
  description: string;
  type: 'birth' | 'death' | 'marriage' | 'achievement' | 'event' | 'migration';
  memberId?: string;
  memberName?: string;
  location?: string;
  icon?: string;
}

export interface NavItem {
  label: string;
  href: string;
  description?: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  badge?: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  quote: string;
  rating: number;
  familySize: number;
}

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: string;
  action: string;
  shortcut?: string;
  category: string;
}
