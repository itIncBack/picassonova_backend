import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class PostImg {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true, type: Date })
  createdAt: Date;

  @Prop({ type: Date, required: false, default: null })
  deletedAt?: Date | null;
}

export const PostImgSchema = SchemaFactory.createForClass(PostImg);
