import { AbstractRepository, EntityRepository, ILike } from 'typeorm';
import { Product } from '@libs/entities';
import { ProductCreateInput, ProductUpdateInput } from '../graphql/inputs';
import { ReadProductsArgs } from '../graphql/args';

@EntityRepository(Product)
export class ProductRepository extends AbstractRepository<Product> {
  public create(product: ProductCreateInput): Promise<Product> {
    return this.repository.save({
      name: product.name,
      ...(product.description && { description: product.description }),
      ...(product.image && { image: product.image.href }),
    });
  }

  public readOneById(id: string): Promise<Product | undefined> {
    return this.repository.findOne(id);
  }

  public read(options: ReadProductsArgs = {}): Promise<Product[]> {
    return this.repository.find({
      where: {
        ...(options.name && { name: ILike(`%${options.name}%`) }),
      },
    });
  }

  public async update(id: string, product: ProductUpdateInput): Promise<Product> {
    // Check if product exists
    await this.repository.findOneOrFail(id);

    // Update and return
    return this.repository.save(
      this.repository.create({
        id,
        ...(product.name && { name: product.name }),
        ...(product.description && { description: product.description }),
        ...(product.image && { image: product.image }),
      }),
    );
  }

  public async delete(id: string): Promise<Product> {
    // Check if product exists
    const product: Product = await this.repository.findOneOrFail(id);

    // Delete
    await this.repository.delete(id);

    // Return deleted product
    return product;
  }
}
