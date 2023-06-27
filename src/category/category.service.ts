import { BadRequestException, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service';
import { Category, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(private prisma: PrismaService) {
    super();
  }

  async create(data: Prisma.CategoryCreateInput) {
    if (await this.prisma.category.findUnique({ where: { name: data.name } }))
      throw new BadRequestException('Category already exists');

    return this.prisma.category.create({
      data,
    });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findOne(where: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.findUnique({
      where,
    });
  }

  update(
    where: Prisma.CategoryWhereUniqueInput,
    data: Prisma.CategoryUpdateInput,
  ) {
    if (data.name && data.name.toString().length >= 10)
      throw new BadRequestException(
        'Name is to long, should be max 10 characters',
      );

    return this.prisma.category.update({
      where,
      data,
    });
  }

  async remove(where: Prisma.CategoryWhereUniqueInput) {
    const isUsed =
      (await this.prisma.income.count({
        where: {
          categoryId: where.id,
        },
      })) > 0 ||
      (await this.prisma.expense.count({
        where: {
          categoryId: where.id,
        },
      }));

    if (isUsed)
      throw new BadRequestException(
        'Category cannot be deleted if there are incomes or expenses using it',
      );

    return this.prisma.category.delete({
      where,
    });
  }

  async totalByCategory(userId: number, categoryId: number) {
    return {
      total:
        (
          await this.prisma.expense.aggregate({
            _sum: {
              quantity: true,
            },
            where: {
              userId,
              categoryId,
            },
          })
        )._sum.quantity +
        (
          await this.prisma.income.aggregate({
            _sum: {
              quantity: true,
            },
            where: {
              userId,
              categoryId,
            },
          })
        )._sum.quantity,
    };
  }
}
