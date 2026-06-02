import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  // دریافت همه کاربران (با صفحه‌بندی)
  async findAllUsers(page = 1, limit = 20) {
    const [data, total] = await this.userRepo.findAndCount({
      select: {
        id: true,
        mobile: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  // تغییر نقش یک کاربر (فقط مالک)
  async changeRole(adminUserId: string, targetUserId: string, newRole: UserRole) {
    // مالک نمی‌تونه نقش خودش رو عوض کنه
    if (adminUserId === targetUserId) {
      throw new ForbiddenException('شما نمی‌توانید نقش خود را تغییر دهید');
    }

    const target = await this.userRepo.findOne({ where: { id: targetUserId } });
    if (!target) throw new NotFoundException('کاربر یافت نشد');

    // برای امنیت، نقش مالک رو فقط مالک دیگه می‌تونه بده (اینجا فقط مالک می‌تونه)
    // ولی چون فقط مالک به این API دسترسی داره، مشکلی نیست
    target.role = newRole;
    await this.userRepo.save(target);
    return { message: 'نقش کاربر با موفقیت تغییر کرد', newRole };
  }

  // دریافت لیست ادمین‌ها (مالک + رتبه‌های ۱ تا ۳)
  async getAdmins() {
    return this.userRepo.find({
      where: [
        { role: UserRole.OWNER },
        { role: UserRole.ADMIN_1 },
        { role: UserRole.ADMIN_2 },
        { role: UserRole.ADMIN_3 },
      ],
      select: {
        id: true,
        mobile: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      order: { createdAt: 'ASC' },
    });
  }
}