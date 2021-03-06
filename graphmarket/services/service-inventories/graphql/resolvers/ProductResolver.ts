import { Arg, Directive, FieldResolver, Resolver, Root } from 'type-graphql';
import { Service } from 'typedi';
import { GraphQLNonNegativeInt, GraphQLPositiveInt } from '@libs/graphql';
import { Product } from '../../entities';

@Resolver(() => Product)
@Service()
export class ProductResolver {
  @FieldResolver(() => GraphQLNonNegativeInt, {
    nullable: true,
    description: `Product shipping estimate`,
  })
  @Directive(`@requires(fields: "price weight")`)
  async shippingEstimate(
    @Arg('quantity', () => GraphQLPositiveInt, { description: `Quantity of product to ship` })
    quantity: number,
    @Root()
    product: Product,
  ): Promise<number | undefined> {
    if (product.quantity <= 0) return undefined;
    if (product.price > 9999) return 0;
    return quantity + product.weight * 0.5;
  }
}
