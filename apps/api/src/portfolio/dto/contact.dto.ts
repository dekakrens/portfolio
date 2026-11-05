import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactInquiryDto {
  @ApiProperty({ example: 'Jane Doe', description: 'Sender name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'jane@example.com', description: 'Sender email' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: 'Project Collaboration Opportunity', description: 'Subject of the message' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  subject: string;

  @ApiProperty({ example: 'Hi Deka, I would love to discuss a project with you.', description: 'Message body' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
