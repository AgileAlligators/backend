import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiCarrierId, ApiCarrierTimestamp } from '../../carrier/carrier.api';
import { GeoJSON } from '../../carrier/models/GeoJson.model';
import { ApiLocation } from '../location.api';

@Schema({
  toJSON: {
    virtuals: true,
    transform: (_, ret: Location) => {
      delete ret._id;
      delete ret.__v;

      (ret as any).coordinates = ret.location.coordinates;
      delete ret.location;

      return ret;
    },
  },
})
export class Location extends Document {
  @ApiCarrierId({ required: true })
  @Prop({ required: true })
  carrierId: string;

  @ApiCarrierTimestamp({ required: true })
  @Prop({ default: () => Date.now() })
  timestamp: number;

  @ApiLocation({ required: true })
  @Prop({ required: true })
  location: GeoJSON;
}

const LocationSchema = SchemaFactory.createForClass(Location);

LocationSchema.index({ location: '2dsphere' });

export const LocationDefinition: ModelDefinition = {
  name: Location.name,
  schema: LocationSchema,
};
