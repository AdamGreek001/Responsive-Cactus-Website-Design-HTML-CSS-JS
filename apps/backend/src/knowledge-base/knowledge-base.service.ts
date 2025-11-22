import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class KnowledgeBaseService {
  constructor(private prisma: PrismaService) {}
  
  async findAll() {
    return this.prisma.knowledgeCategory.findMany({
      include: {
        articles: true,
      },
    });
  }

  async findArticle(slug: string) {
    return this.prisma.knowledgeArticle.findUnique({
      where: { slug },
      include: {
        category: true,
      },
    });
  }
}
