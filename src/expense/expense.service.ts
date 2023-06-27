import { Injectable } from '@nestjs/common';
import { Expense, Prisma } from '@prisma/client';
import { DateFilterDto } from 'src/common/dto/date-filter.dto';
import { BaseService } from 'src/common/service';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class ExpenseService extends BaseService<Expense> {
  constructor(private prisma: PrismaService) {
    super();
  }

  create(data: Prisma.ExpenseCreateInput) {
    return this.prisma.expense.create({
      data,
    });
  }

  findAll(userId: number, categoryId: string) {
    return this.prisma.expense.findMany({
      where: {
        userId,
        categoryId: categoryId ? Number(categoryId) : undefined,
      },
      orderBy: [{ createdAt: 'desc' }],
    });
  }

  findOne(where: Prisma.ExpenseWhereUniqueInput) {
    return this.prisma.expense.findUnique({ where });
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

    return this.prisma.expense.aggregate({
      _sum: {
        quantity: true,
      },
      where,
    });
  }

  update(id: number) {
    return `This action updates a #${id} expense`;
  }

  remove(where: Prisma.ExpenseWhereUniqueInput) {
    return this.prisma.expense.delete({ where });
  }
}
