import { Prisma } from '@prisma/client';

export interface CreateExpenseDto
  extends Omit<Prisma.ExpenseCreateInput, 'user' | 'category'> {
  category: number;
}
