import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CompanyContextService } from '../../services/company-context.service';

@Injectable()
export class CompanyContextMiddleware implements NestMiddleware {
  constructor(private companyContextService: CompanyContextService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      // Extract company ID and validate access
      const companyId = await this.companyContextService.getCompanyId();
      
      // Attach company ID to request for easy access
      req.companyId = companyId;
      
      next();
    } catch (error) {
      next(error);
    }
  }
}