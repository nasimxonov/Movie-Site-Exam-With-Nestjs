import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guard/auth.guard';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('superadmin', 'admin', 'user')
  @Post()
  create(@Body() body: any) {
    return this.userService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Req() req: any) {
    return this.userService.findMe(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('superadmin', 'admin', 'user')
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('superadmin', 'admin', 'user')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('superadmin', 'admin',)
  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.userService.update(id, body);
  }
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles('superadmin')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
