export interface UserProfileInfo {
  name: string;
  role: string;
  email: string;
  avatar: string;
}

export type SettingsTabId = "security" | "notifications" | "language_region";

export interface DeviceSession {
  id: string;
  deviceType: "laptop" | "mobile" | "desktop";
  deviceName: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export const MOCK_PROFILE_DATA: {
  user: UserProfileInfo;
  isTwoFactorEnabled: boolean;
  authenticatorConfigured: boolean;
  devices: DeviceSession[];
} = {
  user: {
    name: "Alex Carter",
    role: "Enterprise Admin",
    email: "alex.carter@technova.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&auto=format&fit=crop",
  },
  isTwoFactorEnabled: true,
  authenticatorConfigured: true,
  devices: [
    {
      id: "dev-1",
      deviceType: "laptop",
      deviceName: 'MacBook Pro 16"',
      location: "San Francisco, CA",
      lastActive: "Active Now",
      isCurrent: true,
    },
    {
      id: "dev-2",
      deviceType: "mobile",
      deviceName: "iPhone 14 Pro",
      location: "San Francisco, CA",
      lastActive: "2 hours ago",
      isCurrent: false,
    },
  ],
};
