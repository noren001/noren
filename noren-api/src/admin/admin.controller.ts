import {
  Controller, Get, Put, Param, Body, UseGuards, Query, Request,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt.strategy';
import { RolesGuard } from '../common/roles.guard';
import { Roles } from '../common/roles.decorator';
import { UserRole } from '../users/user.entity';

@Controller('api/v1/admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.OWNER) // فقط مالک
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users')
  findAllUsers(@Query('page') page: number) {
    return this.adminService.findAllUsers(page || 1);
  }

  @Put('users/:id/role')
  changeRole(
    @Request() req,
    @Param('id') targetUserId: string,
    @Body('role') newRole: UserRole,
  ) {
    return this.adminService.changeRole(req.user.userId, targetUserId, newRole);
  }

  @Get('admins')
  getAdmins() {
    return this.adminService.getAdmins();
  }
}