import cors from 'cors';
import helmet from 'helmet';
import express, { Application } from 'express';

// eslint-disable-next-line import/prefer-default-export
export const applyMiddleware = async (app: Application) => {
  app.use(helmet());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
};
