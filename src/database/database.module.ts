import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        // host: configService.get<string>('DATABASE_HOST'),
        // database: configService.get<string>('DATABASE_NAME'),
        // port: configService.get<number>('DATABASE_PORT'),
        // username: configService.get<string>('DATABASE_USERNAME'),
        // password: configService.get<string>('DATABASE_PASSWORD'),
        entities: ['dist/**/*.entity{.ts,.js}'],
        namingStrategy: new SnakeNamingStrategy(),
         synchronize: true,
        url: process.env.DATABASE_URL,
        ssl: {
           rejectUnauthorized: false,
        },
      }),
    }),
  ],
})
export class DatabaseModule {}
