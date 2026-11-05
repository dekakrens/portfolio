import { Controller, Get, Post, Body, Param, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PortfolioService } from './portfolio.service.js';
import { CreateContactInquiryDto } from './dto/contact.dto.js';

@ApiTags('Portfolio')
@Controller()
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get owner profile information' })
  @ApiResponse({ status: 200, description: 'Returns the primary portfolio owner profile' })
  async getProfile() {
    return this.portfolioService.getProfile();
  }

  @Get('skills')
  @ApiOperation({ summary: 'Get categorized tech stack skills' })
  @ApiResponse({ status: 200, description: 'Returns categorized skills' })
  async getSkills() {
    return this.portfolioService.getSkills();
  }

  @Get('projects')
  @ApiOperation({ summary: 'Get all featured projects with case study and tech stack' })
  @ApiResponse({ status: 200, description: 'Returns list of projects' })
  async getProjects() {
    return this.portfolioService.getProjects();
  }

  @Get('projects/:slug')
  @ApiOperation({ summary: 'Get project details by slug' })
  @ApiParam({ name: 'slug', example: 'ai-smart-water-meter' })
  @ApiResponse({ status: 200, description: 'Returns project details' })
  @ApiResponse({ status: 404, description: 'Project not found' })
  async getProjectBySlug(@Param('slug') slug: string) {
    const project = await this.portfolioService.getProjectBySlug(slug);
    if (!project) {
      throw new NotFoundException(`Project with slug "${slug}" not found`);
    }
    return project;
  }

  @Get('experience')
  @ApiOperation({ summary: 'Get career timeline and work experience' })
  @ApiResponse({ status: 200, description: 'Returns career history' })
  async getExperience() {
    return this.portfolioService.getExperience();
  }

  @Get('testimonials')
  @ApiOperation({ summary: 'Get testimonials and peer recommendations' })
  @ApiResponse({ status: 200, description: 'Returns testimonials' })
  async getTestimonials() {
    return this.portfolioService.getTestimonials();
  }

  @Post('contact')
  @ApiOperation({ summary: 'Submit a new contact inquiry' })
  @ApiResponse({ status: 201, description: 'Contact inquiry recorded' })
  async createContactInquiry(@Body() dto: CreateContactInquiryDto) {
    return this.portfolioService.createContactInquiry(dto);
  }
}
