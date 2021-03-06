import { Field, InputType } from 'type-graphql';
import { Length } from 'class-validator';
import { GraphQLNonEmptyString, GraphQLPositiveInt, GraphQLURL } from '@libs/graphql/scalars';

@InputType('ProductUpdateInput', { description: `Product update input` })
export class ProductUpdateInput {
  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `Product's name` })
  @Length(1, 256)
  name?: string;

  @Field(() => GraphQLNonEmptyString, { nullable: true, description: `Product's description` })
  @Length(1, 512)
  description?: string;

  @Field(() => GraphQLURL, { nullable: true, description: `Product's image` })
  image?: string;

  @Field(() => GraphQLPositiveInt, { nullable: true, description: `Product weight in grams` })
  weight?: number;

  @Field(() => GraphQLPositiveInt, { nullable: true, description: `Product price in cents` })
  price?: number;
}
