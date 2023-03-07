import { SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CarEntity } from './entity';

export type CarDocument = CarEntity & Document;
export const CarSchema = SchemaFactory.createForClass(CarEntity);
