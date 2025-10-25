export interface User {
  id: string;
  email: string;
  displayName: string;
  selectionHistory?: string[];
}

export interface UserDto {
  accessToken: string;
  refreshToken: string;
  email: string;
  displayName: string;
}
