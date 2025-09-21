import type { UUID } from "crypto";

export interface User {
  id: UUID;
  name: string;
  email: string;
}
