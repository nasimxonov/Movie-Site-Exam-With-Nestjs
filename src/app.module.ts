import { Global, Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './common/core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SubscriptionModule } from './modules/subscriptions/subscriptions.module';
import { MoviesModule } from './modules/movies/movies.module';
import { AdminModule } from './modules/admin/admin.module';
import { FavoriteModule } from './modules/favourites/favourites.module';
import { ReviewsModule } from './modules/reviews/review.module';

@Global()
@Module({
  imports: [
    AdminModule,
    MoviesModule,
    SubscriptionModule,
    UsersModule,
    FavoriteModule,
    ReviewsModule,
    DatabaseModule,
    AuthModule,
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {}
