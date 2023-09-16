import { Table, Model, Column } from 'sequelize-typescript';

@Table
export class ShoppingCart extends Model {
  @Column({ defaultValue: 0 })
  userId: number;

  @Column({ defaultValue: 0 })
  productId: number;

  @Column
  shoes_manufacturer: string;

  @Column({ defaultValue: 0 })
  price: number;

  @Column
  country_maufacturer: string;

  @Column
  name: string;

  @Column
  image: string;

  @Column({ defaultValue: 0 })
  in_stock: number;

  @Column({ defaultValue: 0 })
  count: number;

  @Column({ defaultValue: 0 })
  total_price: number;
}
