import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PortalService {
  constructor(private prisma: PrismaService) {}
  
  async findAll() {
    return [];
  }
}
