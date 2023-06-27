import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateIncomeDto } from './dto/create-income.dto';
import { from } from 'rxjs';

@UseGuards(JwtAuthGuard)
@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}

  @Post()
  create(@Req() req, @Body() createIncomeDto: CreateIncomeDto) {
    return this.incomeService.create({
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
    return this.incomeService.findAll(req.user.id, categoryId);
  }

  @Get('summary')
  summary(@Req() req, @Query('from') from, @Query('to') to) {
    return this.incomeService.summary(req.user.id, { from, to });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.incomeService.findOne({ id: +id });
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateIncomeDto: UpdateIncomeDto) {
  //   return this.incomeService.update(+id, updateIncomeDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.incomeService.remove({ id: +id });
  }
}
