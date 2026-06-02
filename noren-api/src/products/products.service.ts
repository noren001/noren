import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
  ) {}

  async findAll(query: any) {
    const { page = 1, limit = 20, search, categoryId } = query;

    const qb = this.productRepo.createQueryBuilder('product');

    if (search) {
      qb.where(
        'product.name ILIKE :search OR product.description ILIKE :search',
        { search: `%${search}%` },
      );
    }

    if (categoryId) {
      qb.andWhere('product.categoryId = :categoryId', { categoryId });
    }

    qb.andWhere('product.isActive = true');

    const [data, total] = await qb
      .orderBy('product.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { slug, isActive: true },
    });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    return product;
  }

  async create(dto: CreateProductDto): Promise<Product> {
    // بررسی slug تکراری
    const existing = await this.productRepo.findOne({
      where: { slug: dto.slug },
    });

    if (existing) {
      throw new BadRequestException('این slug قبلاً استفاده شده است');
    }

    const product = this.productRepo.create(dto);
    return this.productRepo.save(product);
  }

  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    // اگر slug تغییر کرد، بررسی کن تکراری نباشد
    if (dto.slug && dto.slug !== product.slug) {
      const existing = await this.productRepo.findOne({
        where: { slug: dto.slug },
      });

      if (existing) {
        throw new BadRequestException('این slug قبلاً استفاده شده است');
      }
    }

    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number): Promise<void> {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('محصول یافت نشد');
    }

    await this.productRepo.remove(product);
  }
}