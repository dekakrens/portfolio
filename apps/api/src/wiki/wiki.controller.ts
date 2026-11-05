import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { WikiService } from './wiki.service.js';

@ApiTags('Wiki & Digital Garden')
@Controller('wiki')
export class WikiController {
  constructor(private readonly wikiService: WikiService) {}

  @Get('categories')
  @ApiOperation({ summary: 'Get all wiki categories with article count' })
  @ApiResponse({ status: 200, description: 'Categories retrieved successfully.' })
  async getCategories() {
    return this.wikiService.getCategories();
  }

  @Get('articles')
  @ApiOperation({ summary: 'Get published wiki articles (with optional filtering)' })
  @ApiQuery({ name: 'category', required: false, description: 'Category slug' })
  @ApiQuery({ name: 'q', required: false, description: 'Search keyword' })
  @ApiResponse({ status: 200, description: 'Articles retrieved successfully.' })
  async getArticles(
    @Query('category') category?: string,
    @Query('q') query?: string,
  ) {
    return this.wikiService.getArticles(category, query);
  }

  @Get('search')
  @ApiOperation({ summary: 'Instant search across published articles' })
  @ApiQuery({ name: 'q', required: true, description: 'Search term' })
  @ApiResponse({ status: 200, description: 'Search results returned.' })
  async search(@Query('q') query: string) {
    return this.wikiService.searchArticles(query);
  }

  @Get('articles/:slug')
  @ApiOperation({ summary: 'Get a single wiki article by slug with full markdown content' })
  @ApiResponse({ status: 200, description: 'Article retrieved successfully.' })
  @ApiResponse({ status: 404, description: 'Article not found.' })
  async getArticleBySlug(@Param('slug') slug: string) {
    return this.wikiService.getArticleBySlug(slug);
  }
}
