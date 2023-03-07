import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CarDetailsEntity, ICarDetails } from './entity';

export type CarDetailsDocument = ICarDetails & Document;
export const CarDetailsSchema = SchemaFactory.createForClass(CarDetailsEntity);
