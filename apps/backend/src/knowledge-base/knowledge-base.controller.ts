import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { KnowledgeBaseService } from './knowledge-base.service';

@ApiTags('Knowledge Base')
@Controller('knowledge-base')
export class KnowledgeBaseController {
  constructor(private service: KnowledgeBaseService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get('articles/:slug')
  findArticle(@Param('slug') slug: string) {
    return this.service.findArticle(slug);
  }
}
