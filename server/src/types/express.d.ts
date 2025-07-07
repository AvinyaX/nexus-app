declare global {
  namespace Express {
    interface Request {
      user?: any;
      companyId?: string;
    }
  }
}

export {};