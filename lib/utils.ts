import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { FamilyMember } from "@/types/family";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function getAge(dateOfBirth: string, dateOfDeath?: string): number {
  const birth = new Date(dateOfBirth);
  const end = dateOfDeath ? new Date(dateOfDeath) : new Date();
  let age = end.getFullYear() - birth.getFullYear();
  const m = end.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) age--;
  return age;
}

export function getYearRange(member: FamilyMember): string {
  const birthYear = new Date(member.dateOfBirth).getFullYear();
  const endYear = member.dateOfDeath
    ? new Date(member.dateOfDeath).getFullYear()
    : "present";
  return `${birthYear} – ${endYear}`;
}

export function getMemberById(members: FamilyMember[], id: string): FamilyMember | undefined {
  return members.find((m) => m.id === id);
}

export function getChildren(members: FamilyMember[], parentId: string): FamilyMember[] {
  return members.filter((m) => m.parentIds.includes(parentId));
}

export function getSpouse(members: FamilyMember[], member: FamilyMember): FamilyMember | undefined {
  if (!member.spouseId) return undefined;
  return getMemberById(members, member.spouseId);
}

export function getParents(members: FamilyMember[], member: FamilyMember): FamilyMember[] {
  return member.parentIds.map((id) => getMemberById(members, id)).filter(Boolean) as FamilyMember[];
}

export function getGenerationLabel(gen: number): string {
  const labels: Record<number, string> = {
    1: "Patriarch / Matriarch",
    2: "Grandparents",
    3: "Parents",
    4: "Your Generation",
    5: "You",
  };
  return labels[gen] || `Generation ${gen}`;
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

export function generateInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}
