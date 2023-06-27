import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { IncomeModule } from './income/income.module';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    CategoryModule,
    IncomeModule,
    ExpenseModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
