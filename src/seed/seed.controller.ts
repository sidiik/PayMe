import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  @Post('users')
  async seedUsers() {
    return this.seedService.seedUsers();
  }

  @Post('account_types')
  async seedAccountTypes() {
    return this.seedService.seedAccountTypes();
  }
}
