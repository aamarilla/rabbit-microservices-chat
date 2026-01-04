import { UserEntity } from "@app/shared";
import { DataSourceOptions } from "typeorm";

import { DataSource } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
          type: 'postgres',
          url: process.env.POSTGRES_URI,
          entities: [UserEntity],
          migrations: ['dist/apps/auth/db/migrations/*.js'],

}

export const dataSource = new DataSource(dataSourceOptions);