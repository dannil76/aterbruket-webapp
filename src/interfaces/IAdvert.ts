import {
  ItemAMaterialInput,
  ItemAreaOfUseInput,
  ItemCondition,
  ItemAdvertType,
} from "../API";

export interface IAdvert {
  id: string;
  title: string;
  advertType: ItemAdvertType;
  aterbruketId: string;
  status: string;
  category?: string;
  quantity?: number;
  height?: string;
  width?: string;
  length?: string;
  color?: string;
  material?: Array<ItemAMaterialInput | null> | null;
  condition?: ItemCondition;
  areaOfUse?: Array<ItemAreaOfUseInput | null> | null;
  description?: string;
  department?: string;
  location?: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  climateImpact: number;
  version: number;
  revisions: number;
  images: [{ url: string }];
  purchasePrice: number;
  company?: string;
  missingItemsInformation?: string;
  pickUpInformation?: string;
  pickUpInstructions?: string;
  returnInformation?: string;
  accessories?: string[];
  borrowDifficultyLevel?: string;
  accessRestriction?: string;
  accessRestrictionSelection?: string[];
  reservedBySub?: string;
  createdAt: string;
  updatedAt?: string;
}
