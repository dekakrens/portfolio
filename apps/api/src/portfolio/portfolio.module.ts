import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller.js';
import { PortfolioService } from './portfolio.service.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [MailModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
  exports: [PortfolioService],
})
export class PortfolioModule {}
