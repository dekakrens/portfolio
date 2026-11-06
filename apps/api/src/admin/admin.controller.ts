import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AdminService } from './admin.service.js';
import { AdminAuthGuard } from '../auth/admin-auth.guard.js';

@ApiTags('Admin CMS')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // Dashboard Stats
  @Get('stats')
  @ApiOperation({ summary: 'Get CMS Dashboard Stats' })
  getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  // Wiki Articles
  @Get('wiki/articles')
  @ApiOperation({ summary: 'List all wiki articles for admin' })
  getAllArticles() {
    return this.adminService.getAllArticles();
  }

  @Get('wiki/articles/:id')
  @ApiOperation({ summary: 'Get wiki article by id' })
  getArticleById(@Param('id') id: string) {
    return this.adminService.getArticleById(id);
  }

  @Post('wiki/articles')
  @ApiOperation({ summary: 'Create new wiki article' })
  createArticle(@Body() body: any) {
    return this.adminService.createArticle(body);
  }

  @Put('wiki/articles/:id')
  @ApiOperation({ summary: 'Update wiki article' })
  updateArticle(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateArticle(id, body);
  }

  @Delete('wiki/articles/:id')
  @ApiOperation({ summary: 'Delete wiki article' })
  deleteArticle(@Param('id') id: string) {
    return this.adminService.deleteArticle(id);
  }

  @Get('wiki/categories')
  @ApiOperation({ summary: 'List wiki categories' })
  getWikiCategories() {
    return this.adminService.getWikiCategories();
  }

  // Projects
  @Get('projects')
  @ApiOperation({ summary: 'List all projects for admin' })
  getAllProjects() {
    return this.adminService.getAllProjects();
  }

  @Get('projects/:id')
  @ApiOperation({ summary: 'Get project by id' })
  getProjectById(@Param('id') id: string) {
    return this.adminService.getProjectById(id);
  }

  @Post('projects')
  @ApiOperation({ summary: 'Create new project' })
  createProject(@Body() body: any) {
    return this.adminService.createProject(body);
  }

  @Put('projects/:id')
  @ApiOperation({ summary: 'Update project' })
  updateProject(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateProject(id, body);
  }

  @Delete('projects/:id')
  @ApiOperation({ summary: 'Delete project' })
  deleteProject(@Param('id') id: string) {
    return this.adminService.deleteProject(id);
  }

  // Inquiries
  @Get('inquiries')
  @ApiOperation({ summary: 'List all contact inquiries' })
  getAllInquiries() {
    return this.adminService.getAllInquiries();
  }

  @Delete('inquiries/:id')
  @ApiOperation({ summary: 'Delete inquiry' })
  deleteInquiry(@Param('id') id: string) {
    return this.adminService.deleteInquiry(id);
  }

  // Profile
  @Get('profile')
  @ApiOperation({ summary: 'Get profile for CMS' })
  getProfile() {
    return this.adminService.getProfile();
  }

  @Put('profile')
  @ApiOperation({ summary: 'Update profile from CMS' })
  updateProfile(@Body() body: any) {
    return this.adminService.updateProfile(body);
  }

  // Skills & Categories
  @Get('skills')
  @ApiOperation({ summary: 'List all skills grouped by category' })
  getAllSkills() {
    return this.adminService.getAllSkillCategories();
  }

  @Post('skills/categories')
  @ApiOperation({ summary: 'Create a skill category' })
  createSkillCategory(@Body() body: any) {
    return this.adminService.createSkillCategory(body);
  }

  @Put('skills/categories/:id')
  @ApiOperation({ summary: 'Update a skill category' })
  updateSkillCategory(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateSkillCategory(id, body);
  }

  @Delete('skills/categories/:id')
  @ApiOperation({ summary: 'Delete a skill category' })
  deleteSkillCategory(@Param('id') id: string) {
    return this.adminService.deleteSkillCategory(id);
  }

  @Post('skills')
  @ApiOperation({ summary: 'Create a skill' })
  createSkill(@Body() body: any) {
    return this.adminService.createSkill(body);
  }

  @Put('skills/:id')
  @ApiOperation({ summary: 'Update a skill' })
  updateSkill(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateSkill(id, body);
  }

  @Delete('skills/:id')
  @ApiOperation({ summary: 'Delete a skill' })
  deleteSkill(@Param('id') id: string) {
    return this.adminService.deleteSkill(id);
  }

  // Experience (Career Journey)
  @Get('experience')
  @ApiOperation({ summary: 'List all work experiences' })
  getAllExperiences() {
    return this.adminService.getAllExperiences();
  }

  @Post('experience')
  @ApiOperation({ summary: 'Create a work experience' })
  createExperience(@Body() body: any) {
    return this.adminService.createExperience(body);
  }

  @Put('experience/:id')
  @ApiOperation({ summary: 'Update a work experience' })
  updateExperience(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateExperience(id, body);
  }

  @Delete('experience/:id')
  @ApiOperation({ summary: 'Delete a work experience' })
  deleteExperience(@Param('id') id: string) {
    return this.adminService.deleteExperience(id);
  }

  // Testimonials (Feedbacks)
  @Get('testimonials')
  @ApiOperation({ summary: 'List all testimonials / feedbacks' })
  getAllTestimonials() {
    return this.adminService.getAllTestimonials();
  }

  @Post('testimonials')
  @ApiOperation({ summary: 'Create a testimonial' })
  createTestimonial(@Body() body: any) {
    return this.adminService.createTestimonial(body);
  }

  @Put('testimonials/:id')
  @ApiOperation({ summary: 'Update a testimonial' })
  updateTestimonial(@Param('id') id: string, @Body() body: any) {
    return this.adminService.updateTestimonial(id, body);
  }

  @Delete('testimonials/:id')
  @ApiOperation({ summary: 'Delete a testimonial' })
  deleteTestimonial(@Param('id') id: string) {
    return this.adminService.deleteTestimonial(id);
  }
}
