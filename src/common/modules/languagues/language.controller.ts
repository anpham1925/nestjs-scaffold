
import { Controller, Get, Param, SetMetadata } from '@nestjs/common';
import { LanguageService } from './language.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Languages')
@Controller('languages')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) {}

  @SetMetadata('isPublic', true)
  @Get(':lang')
  getHello(@Param('lang') lang: string): string {
    return this.languageService.getResource(lang);
  }
}
