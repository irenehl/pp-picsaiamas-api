import { FileTypeValidator, Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service';
import { Income, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { DateFilterDto } from 'src/common/dto/date-filter.dto';

@Injectable()
export class IncomeService extends BaseService<Income> {
  constructor(private prisma: PrismaService) {
    super();
  }

  create(data: Prisma.IncomeCreateInput) {
    return this.prisma.income.create({
      data,
    });
  }

  findAll(userId: number, categoryId: string) {
    return this.prisma.income.findMany({
      where: {
        userId,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  findOne(where: Prisma.IncomeWhereUniqueInput) {
    return this.prisma.income.findUnique({ where });
  }

  update(id: number) {
    return `This action updates a #${id} income`;
  }

  remove(where: Prisma.IncomeWhereUniqueInput) {
    return this.prisma.income.delete({ where });
  }

  summary(userId: number, filter: DateFilterDto) {
    const where: { userId: number; createdAt?: any } = {
      userId,
    };

    if (filter && filter.to && filter.from) {
      where.createdAt = {
        lte: new Date(filter.to),
        gte: new Date(filter.from),
      };
    }

    return this.prisma.income.aggregate({
      _sum: {
        quantity: true,
      },
      where,
    });
  }
}
