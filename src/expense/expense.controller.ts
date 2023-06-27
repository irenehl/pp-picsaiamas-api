import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  Query,
  Delete,
} from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('expense')
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  @Post()
  create(@Req() req, @Body() createIncomeDto: CreateExpenseDto) {
    return this.expenseService.create({
      ...createIncomeDto,
      category: {
        connect: {
          id: createIncomeDto.category,
        },
      },
      user: {
        connect: {
          id: req.user.id,
        },
      },
    });
  }

  @Get()
  findAll(@Req() req, @Query('categoryId') categoryId?: string) {
    return this.expenseService.findAll(req.user.id, categoryId);
  }

  @Get('summary')
  summary(@Req() req, @Query('from') from, @Query('to') to) {
    return this.expenseService.summary(req.user.id, { from, to });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne({ id: +id });
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
  //   return this.expenseService.update(+id, updateIncomeDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove({ id: +id });
  }
}
