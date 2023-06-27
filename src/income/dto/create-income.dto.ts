import { Prisma } from '@prisma/client';

export interface CreateIncomeDto
  extends Omit<Prisma.IncomeCreateInput, 'user' | 'category'> {
  category: number;
}
