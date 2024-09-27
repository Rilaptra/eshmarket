export interface Product {
  _id: string;
  title: string;
  description: string;
  price: {
    money: number;
    dl: number;
  };
}

export interface User {
  _id: string;
  username: string;
  profileImage: string;
  role: string;
  isAdmin: boolean;
  balance: {
    dl: number;
    money: number;
  };
  scriptBuyed: Array<string>;
  chart: Array<object>;
}

export interface DiscordOAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string | null;
  avatar: string | null;
  bot?: boolean;
  system?: boolean;
  mfa_enabled?: boolean;
  guilds?: UserGuildsResponse | null;
  banner?: string | null;
  accent_color?: number | null;
  locale?: string;
  verified?: boolean;
  email?: string | null;
  flags?: number;
  premium_type?: number;
  public_flags?: number;
}

// Interface for a single guild object
export interface PartialGuild {
  id: string; // The guild's unique snowflake ID
  name: string; // The name of the guild
  icon: string | null; // The guild's icon hash, or null if no icon
  owner: boolean; // Whether the user is the owner of the guild
  permissions: string; // The user's permissions in the guild (as a string of permissions)
  features: string[]; // Array of guild feature strings
}

// Interface for the entire API response
export type UserGuildsResponse = Array<PartialGuild>;
