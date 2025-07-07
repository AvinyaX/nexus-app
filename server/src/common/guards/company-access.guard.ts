import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { CompanyContextService } from '../../services/company-context.service';

@Injectable()
export class CompanyAccessGuard implements CanActivate {
  constructor(private companyContextService: CompanyContextService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // This will validate company access and set the context
      await this.companyContextService.getCompanyId();
      return true;
    } catch (error) {
      return false;
    }
  }
}