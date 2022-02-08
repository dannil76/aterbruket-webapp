import { ItemAMaterialInput, ItemAreaOfUseInput } from "../API";

export interface IReservation {
  borrowedBySub: string;
  status: string;
  dateStart: string;
  dateEnd: string;
}

export interface IAdvert {
  id: string;
  title: string;
  advertType: string;
  aterbruketId: string;
  status: string;
  category?: string;
  quantity?: number;
  height?: string;
  width?: string;
  length?: string;
  color?: string;
  material?: Array<ItemAMaterialInput | null> | null;
  condition?: string;
  areaOfUse?: Array<ItemAreaOfUseInput | null> | null;
  description?: string;
  department?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  contactPerson?: string;
  email?: string;
  phoneNumber?: string;
  climateImpact?: number;
  version: number;
  revisions: number;
  images: { alt: string; src: string }[];
  purchasePrice: string;
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
  advertBorrowCalendar?: {
    allowedDateStart: string;
    allowedDateEnd: string;
    calendarEvents: Array<IReservation>;
  };
}
