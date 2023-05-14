import { AppCollectionField } from './appcollectionfields.entity';
import { Product } from './product.entity';
import { ProductMovement } from './productmovement.entity';
import { Translation } from './translation.entity';
import { User } from './user.entity';

export type Collection = {
  id: string;
  appcollectionfields: AppCollectionField[];
  products: Product[];
  productmovements: ProductMovement[];
  translations: Translation[];
  users: User[];
};
