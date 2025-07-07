import { Injectable, Scope, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Injectable({ scope: Scope.REQUEST })
export class CompanyContextService {
  private companyId: string | null = null;

  constructor(
    @Inject(REQUEST) private request: Request,
    private prisma: PrismaService,
  ) {}

  async getCompanyId(): Promise<string> {
    if (this.companyId) {
      return this.companyId;
    }

    // Try to get company ID from headers first
    const headerCompanyId = this.request.headers['x-company-id'] as string;
    if (headerCompanyId) {
      await this.validateCompanyAccess(headerCompanyId);
      this.companyId = headerCompanyId;
      return this.companyId;
    }

    // Try to get from query params
    const queryCompanyId = this.request.query?.companyId as string;
    if (queryCompanyId) {
      await this.validateCompanyAccess(queryCompanyId);
      this.companyId = queryCompanyId;
      return this.companyId;
    }

    // If no company ID provided, try to get user's default company
    const userId = this.request.user?.id || this.request.user?.userId;
    if (userId) {
      const userCompany = await this.prisma.userCompany.findFirst({
        where: {
          userId,
          isDefault: true,
        },
      });

      if (userCompany) {
        this.companyId = userCompany.companyId;
        return this.companyId;
      }
    }

    throw new HttpException(
      'Company context is required. Please provide x-company-id header or companyId query parameter.',
      HttpStatus.BAD_REQUEST,
    );
  }

  private async validateCompanyAccess(companyId: string): Promise<void> {
    // Check if company exists
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) {
      throw new HttpException('Company not found', HttpStatus.NOT_FOUND);
    }

    if (!company.isActive) {
      throw new HttpException('Company is not active', HttpStatus.FORBIDDEN);
    }

    // Check if user has access to this company
    const userId = this.request.user?.id;
    if (userId) {
      const userCompany = await this.prisma.userCompany.findUnique({
        where: {
          userId_companyId: {
            userId,
            companyId,
          },
        },
      });

      if (!userCompany) {
        throw new HttpException(
          'You do not have access to this company',
          HttpStatus.FORBIDDEN,
        );
      }
    }
  }

  async getCompanySettings(): Promise<any> {
    const companyId = await this.getCompanyId();
    const company = await this.prisma.company.findUnique({
      where: { id: companyId },
      select: { settings: true },
    });

    return company?.settings || {};
  }

  async updateCompanySettings(settings: any): Promise<void> {
    const companyId = await this.getCompanyId();
    await this.prisma.company.update({
      where: { id: companyId },
      data: { settings },
    });
  }
}