export interface Health {
  id: string;
  status: string;
  message: string;
}

export interface CreateHealthDto {
  status: string;
  message: string;
}

export interface UpdateHealthDto {
  status?: string;
  message?: string;
}
