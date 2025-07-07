declare global {
  namespace Express {
    interface User {
      id: string;
      userId?: string;
      username?: string;
      [key: string]: any;
    }
    
    interface Request {
      user?: User;
      companyId?: string;
    }
  }
}

export {};