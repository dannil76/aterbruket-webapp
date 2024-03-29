/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAdvertInput = {
  id?: string | null,
  title: string,
  description?: string | null,
  height?: string | null,
  width?: string | null,
  length?: string | null,
  status?: ItemStatus | null,
  category?: string | null,
  material?: Array< ItemAMaterialInput | null > | null,
  condition?: ItemCondition | null,
  color?: string | null,
  areaOfUse?: Array< ItemAreaOfUseInput | null > | null,
  images?: Array< ItemImagesInput | null > | null,
  quantity?: number | null,
  department?: string | null,
  instructions?: string | null,
  contactPerson?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  giver?: string | null,
  version: number,
  climateImpact?: number | null,
  reservedBySub?: string | null,
  reservedByName?: string | null,
  revisions?: number | null,
  purchasePrice?: string | null,
  company?: string | null,
  aterbruketId?: string | null,
  advertType?: ItemAdvertType | null,
  missingItemsInformation?: string | null,
  pickUpInformation?: string | null,
  returnInformation?: string | null,
  pickUpInstructions?: string | null,
  accessories?: Array< string | null > | null,
  borrowDifficultyLevel?: string | null,
  advertBorrowCalendar?: AdvertBorrowCalendarInput | null,
  accessRestriction?: string | null,
  accessRestrictionSelection?: AdministrationInput | null,
  address?: string | null,
  city?: string | null,
  postalCode?: string | null,
  missingAccessories?: Array< MissingAccessoriesInput | null > | null,
};

export enum ItemStatus {
  available = "available",
  reserved = "reserved",
  pickedUp = "pickedUp",
}


export type ItemAMaterialInput = {
  wood?: boolean | null,
  plastic?: boolean | null,
  metal?: boolean | null,
  other?: boolean | null,
};

export enum ItemCondition {
  Anew = "Anew",
  Bgood = "Bgood",
  Cworn = "Cworn",
}


export type ItemAreaOfUseInput = {
  indoors?: boolean | null,
  outside?: boolean | null,
};

export type ItemImagesInput = {
  src?: string | null,
  alt?: string | null,
};

export enum ItemAdvertType {
  recycle = "recycle",
  borrow = "borrow",
}


export type AdvertBorrowCalendarInput = {
  allowedDateStart?: string | null,
  allowedDateEnd?: string | null,
  calendarEvents?: Array< CalendarEventInput | null > | null,
};

export type CalendarEventInput = {
  borrowedBySub?: string | null,
  status?: string | null,
  dateStart?: string | null,
  dateEnd?: string | null,
  returnDateTime?: string | null,
};

export type AdministrationInput = {
  arbetsmarknadsforvaltningen?: boolean | null,
  fastighetsforvaltningen?: boolean | null,
  kulturforvaltningen?: boolean | null,
  miljoforvaltningen?: boolean | null,
  skolOchFritidsforvaltningen?: boolean | null,
  socialforvaltningen?: boolean | null,
  stadsbyggnadsforvaltningen?: boolean | null,
  stadsledningsforvaltningen?: boolean | null,
  vardOchOmsorgsforvaltningen?: boolean | null,
};

export type MissingAccessoriesInput = {
  reportedBy: string,
  reportedDate: string,
  accessories: Array< string | null >,
  lastReturnedBy: string,
};

export type ModelAdvertConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  height?: ModelStringInput | null,
  width?: ModelStringInput | null,
  length?: ModelStringInput | null,
  status?: ModelItemStatusInput | null,
  category?: ModelStringInput | null,
  condition?: ModelItemConditionInput | null,
  color?: ModelStringInput | null,
  quantity?: ModelIntInput | null,
  department?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  contactPerson?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  giver?: ModelStringInput | null,
  climateImpact?: ModelIntInput | null,
  reservedBySub?: ModelStringInput | null,
  reservedByName?: ModelStringInput | null,
  revisions?: ModelIntInput | null,
  purchasePrice?: ModelStringInput | null,
  company?: ModelStringInput | null,
  aterbruketId?: ModelStringInput | null,
  advertType?: ModelItemAdvertTypeInput | null,
  missingItemsInformation?: ModelStringInput | null,
  pickUpInformation?: ModelStringInput | null,
  returnInformation?: ModelStringInput | null,
  pickUpInstructions?: ModelStringInput | null,
  accessories?: ModelStringInput | null,
  borrowDifficultyLevel?: ModelStringInput | null,
  accessRestriction?: ModelStringInput | null,
  address?: ModelStringInput | null,
  city?: ModelStringInput | null,
  postalCode?: ModelStringInput | null,
  and?: Array< ModelAdvertConditionInput | null > | null,
  or?: Array< ModelAdvertConditionInput | null > | null,
  not?: ModelAdvertConditionInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelItemStatusInput = {
  eq?: ItemStatus | null,
  ne?: ItemStatus | null,
};

export type ModelItemConditionInput = {
  eq?: ItemCondition | null,
  ne?: ItemCondition | null,
};

export type ModelIntInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelItemAdvertTypeInput = {
  eq?: ItemAdvertType | null,
  ne?: ItemAdvertType | null,
};

export type Advert = {
  __typename: "Advert",
  id: string,
  title: string,
  description?: string | null,
  height?: string | null,
  width?: string | null,
  length?: string | null,
  status?: ItemStatus | null,
  category?: string | null,
  material?:  Array<ItemAMaterial | null > | null,
  condition?: ItemCondition | null,
  color?: string | null,
  areaOfUse?:  Array<ItemAreaOfUse | null > | null,
  images?:  Array<ItemImages | null > | null,
  quantity?: number | null,
  department?: string | null,
  instructions?: string | null,
  contactPerson?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  giver?: string | null,
  version: number,
  climateImpact?: number | null,
  reservedBySub?: string | null,
  reservedByName?: string | null,
  revisions?: number | null,
  purchasePrice?: string | null,
  company?: string | null,
  aterbruketId?: string | null,
  advertType?: ItemAdvertType | null,
  missingItemsInformation?: string | null,
  pickUpInformation?: string | null,
  returnInformation?: string | null,
  pickUpInstructions?: string | null,
  accessories?: Array< string | null > | null,
  borrowDifficultyLevel?: string | null,
  advertBorrowCalendar?: AdvertBorrowCalendar | null,
  accessRestriction?: string | null,
  accessRestrictionSelection?: Administration | null,
  address?: string | null,
  city?: string | null,
  postalCode?: string | null,
  missingAccessories?:  Array<MissingAccessories | null > | null,
  createdAt: string,
  updatedAt: string,
};

export type ItemAMaterial = {
  __typename: "ItemAMaterial",
  wood?: boolean | null,
  plastic?: boolean | null,
  metal?: boolean | null,
  other?: boolean | null,
};

export type ItemAreaOfUse = {
  __typename: "ItemAreaOfUse",
  indoors?: boolean | null,
  outside?: boolean | null,
};

export type ItemImages = {
  __typename: "ItemImages",
  src?: string | null,
  alt?: string | null,
};

export type AdvertBorrowCalendar = {
  __typename: "AdvertBorrowCalendar",
  allowedDateStart?: string | null,
  allowedDateEnd?: string | null,
  calendarEvents?:  Array<CalendarEvent | null > | null,
};

export type CalendarEvent = {
  __typename: "CalendarEvent",
  borrowedBySub?: string | null,
  status?: string | null,
  dateStart?: string | null,
  dateEnd?: string | null,
  returnDateTime?: string | null,
};

export type Administration = {
  __typename: "Administration",
  arbetsmarknadsforvaltningen?: boolean | null,
  fastighetsforvaltningen?: boolean | null,
  kulturforvaltningen?: boolean | null,
  miljoforvaltningen?: boolean | null,
  skolOchFritidsforvaltningen?: boolean | null,
  socialforvaltningen?: boolean | null,
  stadsbyggnadsforvaltningen?: boolean | null,
  stadsledningsforvaltningen?: boolean | null,
  vardOchOmsorgsforvaltningen?: boolean | null,
};

export type MissingAccessories = {
  __typename: "MissingAccessories",
  reportedBy: string,
  reportedDate: string,
  accessories: Array< string | null >,
  lastReturnedBy: string,
};

export type UpdateAdvertInput = {
  id: string,
  title?: string | null,
  description?: string | null,
  height?: string | null,
  width?: string | null,
  length?: string | null,
  status?: ItemStatus | null,
  category?: string | null,
  material?: Array< ItemAMaterialInput | null > | null,
  condition?: ItemCondition | null,
  color?: string | null,
  areaOfUse?: Array< ItemAreaOfUseInput | null > | null,
  images?: Array< ItemImagesInput | null > | null,
  quantity?: number | null,
  department?: string | null,
  instructions?: string | null,
  contactPerson?: string | null,
  email?: string | null,
  phoneNumber?: string | null,
  giver?: string | null,
  version: number,
  climateImpact?: number | null,
  reservedBySub?: string | null,
  reservedByName?: string | null,
  revisions?: number | null,
  purchasePrice?: string | null,
  company?: string | null,
  aterbruketId?: string | null,
  advertType?: ItemAdvertType | null,
  missingItemsInformation?: string | null,
  pickUpInformation?: string | null,
  returnInformation?: string | null,
  pickUpInstructions?: string | null,
  accessories?: Array< string | null > | null,
  borrowDifficultyLevel?: string | null,
  advertBorrowCalendar?: AdvertBorrowCalendarInput | null,
  accessRestriction?: string | null,
  accessRestrictionSelection?: AdministrationInput | null,
  address?: string | null,
  city?: string | null,
  postalCode?: string | null,
  missingAccessories?: Array< MissingAccessoriesInput | null > | null,
};

export type DeleteAdvertInput = {
  id: string,
  version: number,
};

export type CreatePageInput = {
  id?: string | null,
  slug: string,
  title: string,
  content?: string | null,
};

export type ModelPageConditionInput = {
  title?: ModelStringInput | null,
  content?: ModelStringInput | null,
  and?: Array< ModelPageConditionInput | null > | null,
  or?: Array< ModelPageConditionInput | null > | null,
  not?: ModelPageConditionInput | null,
};

export type Page = {
  __typename: "Page",
  id: string,
  slug: string,
  title: string,
  content?: string | null,
  createdAt: string,
  updatedAt: string,
};

export type UpdatePageInput = {
  id?: string | null,
  slug: string,
  title?: string | null,
  content?: string | null,
};

export type DeletePageInput = {
  slug: string,
};

export type ModelIntKeyConditionInput = {
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelAdvertFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  height?: ModelStringInput | null,
  width?: ModelStringInput | null,
  length?: ModelStringInput | null,
  status?: ModelItemStatusInput | null,
  category?: ModelStringInput | null,
  condition?: ModelItemConditionInput | null,
  color?: ModelStringInput | null,
  quantity?: ModelIntInput | null,
  department?: ModelStringInput | null,
  instructions?: ModelStringInput | null,
  contactPerson?: ModelStringInput | null,
  email?: ModelStringInput | null,
  phoneNumber?: ModelStringInput | null,
  giver?: ModelStringInput | null,
  version?: ModelIntInput | null,
  climateImpact?: ModelIntInput | null,
  reservedBySub?: ModelStringInput | null,
  reservedByName?: ModelStringInput | null,
  revisions?: ModelIntInput | null,
  purchasePrice?: ModelStringInput | null,
  company?: ModelStringInput | null,
  aterbruketId?: ModelStringInput | null,
  advertType?: ModelItemAdvertTypeInput | null,
  missingItemsInformation?: ModelStringInput | null,
  pickUpInformation?: ModelStringInput | null,
  returnInformation?: ModelStringInput | null,
  pickUpInstructions?: ModelStringInput | null,
  accessories?: ModelStringInput | null,
  borrowDifficultyLevel?: ModelStringInput | null,
  accessRestriction?: ModelStringInput | null,
  address?: ModelStringInput | null,
  city?: ModelStringInput | null,
  postalCode?: ModelStringInput | null,
  and?: Array< ModelAdvertFilterInput | null > | null,
  or?: Array< ModelAdvertFilterInput | null > | null,
  not?: ModelAdvertFilterInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelSortDirection {
  ASC = "ASC",
  DESC = "DESC",
}


export type ModelAdvertConnection = {
  __typename: "ModelAdvertConnection",
  items:  Array<Advert | null >,
  nextToken?: string | null,
};

export type ModelPageFilterInput = {
  id?: ModelIDInput | null,
  slug?: ModelStringInput | null,
  title?: ModelStringInput | null,
  content?: ModelStringInput | null,
  and?: Array< ModelPageFilterInput | null > | null,
  or?: Array< ModelPageFilterInput | null > | null,
  not?: ModelPageFilterInput | null,
};

export type ModelPageConnection = {
  __typename: "ModelPageConnection",
  items:  Array<Page | null >,
  nextToken?: string | null,
};

export type CreateAdvertMutationVariables = {
  input: CreateAdvertInput,
  condition?: ModelAdvertConditionInput | null,
};

export type CreateAdvertMutation = {
  createAdvert?:  {
    __typename: "Advert",
    id: string,
    title: string,
    description?: string | null,
    height?: string | null,
    width?: string | null,
    length?: string | null,
    status?: ItemStatus | null,
    category?: string | null,
    material?:  Array< {
      __typename: "ItemAMaterial",
      wood?: boolean | null,
      plastic?: boolean | null,
      metal?: boolean | null,
      other?: boolean | null,
    } | null > | null,
    condition?: ItemCondition | null,
    color?: string | null,
    areaOfUse?:  Array< {
      __typename: "ItemAreaOfUse",
      indoors?: boolean | null,
      outside?: boolean | null,
    } | null > | null,
    images?:  Array< {
      __typename: "ItemImages",
      src?: string | null,
      alt?: string | null,
    } | null > | null,
    quantity?: number | null,
    department?: string | null,
    instructions?: string | null,
    contactPerson?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    giver?: string | null,
    version: number,
    climateImpact?: number | null,
    reservedBySub?: string | null,
    reservedByName?: string | null,
    revisions?: number | null,
    purchasePrice?: string | null,
    company?: string | null,
    aterbruketId?: string | null,
    advertType?: ItemAdvertType | null,
    missingItemsInformation?: string | null,
    pickUpInformation?: string | null,
    returnInformation?: string | null,
    pickUpInstructions?: string | null,
    accessories?: Array< string | null > | null,
    borrowDifficultyLevel?: string | null,
    advertBorrowCalendar?:  {
      __typename: "AdvertBorrowCalendar",
      allowedDateStart?: string | null,
      allowedDateEnd?: string | null,
      calendarEvents?:  Array< {
        __typename: "CalendarEvent",
        borrowedBySub?: string | null,
        status?: string | null,
        dateStart?: string | null,
        dateEnd?: string | null,
        returnDateTime?: string | null,
      } | null > | null,
    } | null,
    accessRestriction?: string | null,
    accessRestrictionSelection?:  {
      __typename: "Administration",
      arbetsmarknadsforvaltningen?: boolean | null,
      fastighetsforvaltningen?: boolean | null,
      kulturforvaltningen?: boolean | null,
      miljoforvaltningen?: boolean | null,
      skolOchFritidsforvaltningen?: boolean | null,
      socialforvaltningen?: boolean | null,
      stadsbyggnadsforvaltningen?: boolean | null,
      stadsledningsforvaltningen?: boolean | null,
      vardOchOmsorgsforvaltningen?: boolean | null,
    } | null,
    address?: string | null,
    city?: string | null,
    postalCode?: string | null,
    missingAccessories?:  Array< {
      __typename: "MissingAccessories",
      reportedBy: string,
      reportedDate: string,
      accessories: Array< string | null >,
      lastReturnedBy: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAdvertMutationVariables = {
  input: UpdateAdvertInput,
  condition?: ModelAdvertConditionInput | null,
};

export type UpdateAdvertMutation = {
  updateAdvert?:  {
    __typename: "Advert",
    id: string,
    title: string,
    description?: string | null,
    height?: string | null,
    width?: string | null,
    length?: string | null,
    status?: ItemStatus | null,
    category?: string | null,
    material?:  Array< {
      __typename: "ItemAMaterial",
      wood?: boolean | null,
      plastic?: boolean | null,
      metal?: boolean | null,
      other?: boolean | null,
    } | null > | null,
    condition?: ItemCondition | null,
    color?: string | null,
    areaOfUse?:  Array< {
      __typename: "ItemAreaOfUse",
      indoors?: boolean | null,
      outside?: boolean | null,
    } | null > | null,
    images?:  Array< {
      __typename: "ItemImages",
      src?: string | null,
      alt?: string | null,
    } | null > | null,
    quantity?: number | null,
    department?: string | null,
    instructions?: string | null,
    contactPerson?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    giver?: string | null,
    version: number,
    climateImpact?: number | null,
    reservedBySub?: string | null,
    reservedByName?: string | null,
    revisions?: number | null,
    purchasePrice?: string | null,
    company?: string | null,
    aterbruketId?: string | null,
    advertType?: ItemAdvertType | null,
    missingItemsInformation?: string | null,
    pickUpInformation?: string | null,
    returnInformation?: string | null,
    pickUpInstructions?: string | null,
    accessories?: Array< string | null > | null,
    borrowDifficultyLevel?: string | null,
    advertBorrowCalendar?:  {
      __typename: "AdvertBorrowCalendar",
      allowedDateStart?: string | null,
      allowedDateEnd?: string | null,
      calendarEvents?:  Array< {
        __typename: "CalendarEvent",
        borrowedBySub?: string | null,
        status?: string | null,
        dateStart?: string | null,
        dateEnd?: string | null,
        returnDateTime?: string | null,
      } | null > | null,
    } | null,
    accessRestriction?: string | null,
    accessRestrictionSelection?:  {
      __typename: "Administration",
      arbetsmarknadsforvaltningen?: boolean | null,
      fastighetsforvaltningen?: boolean | null,
      kulturforvaltningen?: boolean | null,
      miljoforvaltningen?: boolean | null,
      skolOchFritidsforvaltningen?: boolean | null,
      socialforvaltningen?: boolean | null,
      stadsbyggnadsforvaltningen?: boolean | null,
      stadsledningsforvaltningen?: boolean | null,
      vardOchOmsorgsforvaltningen?: boolean | null,
    } | null,
    address?: string | null,
    city?: string | null,
    postalCode?: string | null,
    missingAccessories?:  Array< {
      __typename: "MissingAccessories",
      reportedBy: string,
      reportedDate: string,
      accessories: Array< string | null >,
      lastReturnedBy: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAdvertMutationVariables = {
  input: DeleteAdvertInput,
  condition?: ModelAdvertConditionInput | null,
};

export type DeleteAdvertMutation = {
  deleteAdvert?:  {
    __typename: "Advert",
    id: string,
    title: string,
    description?: string | null,
    height?: string | null,
    width?: string | null,
    length?: string | null,
    status?: ItemStatus | null,
    category?: string | null,
    material?:  Array< {
      __typename: "ItemAMaterial",
      wood?: boolean | null,
      plastic?: boolean | null,
      metal?: boolean | null,
      other?: boolean | null,
    } | null > | null,
    condition?: ItemCondition | null,
    color?: string | null,
    areaOfUse?:  Array< {
      __typename: "ItemAreaOfUse",
      indoors?: boolean | null,
      outside?: boolean | null,
    } | null > | null,
    images?:  Array< {
      __typename: "ItemImages",
      src?: string | null,
      alt?: string | null,
    } | null > | null,
    quantity?: number | null,
    department?: string | null,
    instructions?: string | null,
    contactPerson?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    giver?: string | null,
    version: number,
    climateImpact?: number | null,
    reservedBySub?: string | null,
    reservedByName?: string | null,
    revisions?: number | null,
    purchasePrice?: string | null,
    company?: string | null,
    aterbruketId?: string | null,
    advertType?: ItemAdvertType | null,
    missingItemsInformation?: string | null,
    pickUpInformation?: string | null,
    returnInformation?: string | null,
    pickUpInstructions?: string | null,
    accessories?: Array< string | null > | null,
    borrowDifficultyLevel?: string | null,
    advertBorrowCalendar?:  {
      __typename: "AdvertBorrowCalendar",
      allowedDateStart?: string | null,
      allowedDateEnd?: string | null,
      calendarEvents?:  Array< {
        __typename: "CalendarEvent",
        borrowedBySub?: string | null,
        status?: string | null,
        dateStart?: string | null,
        dateEnd?: string | null,
        returnDateTime?: string | null,
      } | null > | null,
    } | null,
    accessRestriction?: string | null,
    accessRestrictionSelection?:  {
      __typename: "Administration",
      arbetsmarknadsforvaltningen?: boolean | null,
      fastighetsforvaltningen?: boolean | null,
      kulturforvaltningen?: boolean | null,
      miljoforvaltningen?: boolean | null,
      skolOchFritidsforvaltningen?: boolean | null,
      socialforvaltningen?: boolean | null,
      stadsbyggnadsforvaltningen?: boolean | null,
      stadsledningsforvaltningen?: boolean | null,
      vardOchOmsorgsforvaltningen?: boolean | null,
    } | null,
    address?: string | null,
    city?: string | null,
    postalCode?: string | null,
    missingAccessories?:  Array< {
      __typename: "MissingAccessories",
      reportedBy: string,
      reportedDate: string,
      accessories: Array< string | null >,
      lastReturnedBy: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type CreatePageMutationVariables = {
  input: CreatePageInput,
  condition?: ModelPageConditionInput | null,
};

export type CreatePageMutation = {
  createPage?:  {
    __typename: "Page",
    id: string,
    slug: string,
    title: string,
    content?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdatePageMutationVariables = {
  input: UpdatePageInput,
  condition?: ModelPageConditionInput | null,
};

export type UpdatePageMutation = {
  updatePage?:  {
    __typename: "Page",
    id: string,
    slug: string,
    title: string,
    content?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeletePageMutationVariables = {
  input: DeletePageInput,
  condition?: ModelPageConditionInput | null,
};

export type DeletePageMutation = {
  deletePage?:  {
    __typename: "Page",
    id: string,
    slug: string,
    title: string,
    content?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetAdvertQueryVariables = {
  id: string,
  version: number,
};

export type GetAdvertQuery = {
  getAdvert?:  {
    __typename: "Advert",
    id: string,
    title: string,
    description?: string | null,
    height?: string | null,
    width?: string | null,
    length?: string | null,
    status?: ItemStatus | null,
    category?: string | null,
    material?:  Array< {
      __typename: "ItemAMaterial",
      wood?: boolean | null,
      plastic?: boolean | null,
      metal?: boolean | null,
      other?: boolean | null,
    } | null > | null,
    condition?: ItemCondition | null,
    color?: string | null,
    areaOfUse?:  Array< {
      __typename: "ItemAreaOfUse",
      indoors?: boolean | null,
      outside?: boolean | null,
    } | null > | null,
    images?:  Array< {
      __typename: "ItemImages",
      src?: string | null,
      alt?: string | null,
    } | null > | null,
    quantity?: number | null,
    department?: string | null,
    instructions?: string | null,
    contactPerson?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    giver?: string | null,
    version: number,
    climateImpact?: number | null,
    reservedBySub?: string | null,
    reservedByName?: string | null,
    revisions?: number | null,
    purchasePrice?: string | null,
    company?: string | null,
    aterbruketId?: string | null,
    advertType?: ItemAdvertType | null,
    missingItemsInformation?: string | null,
    pickUpInformation?: string | null,
    returnInformation?: string | null,
    pickUpInstructions?: string | null,
    accessories?: Array< string | null > | null,
    borrowDifficultyLevel?: string | null,
    advertBorrowCalendar?:  {
      __typename: "AdvertBorrowCalendar",
      allowedDateStart?: string | null,
      allowedDateEnd?: string | null,
      calendarEvents?:  Array< {
        __typename: "CalendarEvent",
        borrowedBySub?: string | null,
        status?: string | null,
        dateStart?: string | null,
        dateEnd?: string | null,
        returnDateTime?: string | null,
      } | null > | null,
    } | null,
    accessRestriction?: string | null,
    accessRestrictionSelection?:  {
      __typename: "Administration",
      arbetsmarknadsforvaltningen?: boolean | null,
      fastighetsforvaltningen?: boolean | null,
      kulturforvaltningen?: boolean | null,
      miljoforvaltningen?: boolean | null,
      skolOchFritidsforvaltningen?: boolean | null,
      socialforvaltningen?: boolean | null,
      stadsbyggnadsforvaltningen?: boolean | null,
      stadsledningsforvaltningen?: boolean | null,
      vardOchOmsorgsforvaltningen?: boolean | null,
    } | null,
    address?: string | null,
    city?: string | null,
    postalCode?: string | null,
    missingAccessories?:  Array< {
      __typename: "MissingAccessories",
      reportedBy: string,
      reportedDate: string,
      accessories: Array< string | null >,
      lastReturnedBy: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAdvertsQueryVariables = {
  id?: string | null,
  version?: ModelIntKeyConditionInput | null,
  filter?: ModelAdvertFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListAdvertsQuery = {
  listAdverts?:  {
    __typename: "ModelAdvertConnection",
    items:  Array< {
      __typename: "Advert",
      id: string,
      title: string,
      description?: string | null,
      height?: string | null,
      width?: string | null,
      length?: string | null,
      status?: ItemStatus | null,
      category?: string | null,
      material?:  Array< {
        __typename: "ItemAMaterial",
        wood?: boolean | null,
        plastic?: boolean | null,
        metal?: boolean | null,
        other?: boolean | null,
      } | null > | null,
      condition?: ItemCondition | null,
      color?: string | null,
      areaOfUse?:  Array< {
        __typename: "ItemAreaOfUse",
        indoors?: boolean | null,
        outside?: boolean | null,
      } | null > | null,
      images?:  Array< {
        __typename: "ItemImages",
        src?: string | null,
        alt?: string | null,
      } | null > | null,
      quantity?: number | null,
      department?: string | null,
      instructions?: string | null,
      contactPerson?: string | null,
      email?: string | null,
      phoneNumber?: string | null,
      giver?: string | null,
      version: number,
      climateImpact?: number | null,
      reservedBySub?: string | null,
      reservedByName?: string | null,
      revisions?: number | null,
      purchasePrice?: string | null,
      company?: string | null,
      aterbruketId?: string | null,
      advertType?: ItemAdvertType | null,
      missingItemsInformation?: string | null,
      pickUpInformation?: string | null,
      returnInformation?: string | null,
      pickUpInstructions?: string | null,
      accessories?: Array< string | null > | null,
      borrowDifficultyLevel?: string | null,
      advertBorrowCalendar?:  {
        __typename: "AdvertBorrowCalendar",
        allowedDateStart?: string | null,
        allowedDateEnd?: string | null,
        calendarEvents?:  Array< {
          __typename: "CalendarEvent",
          borrowedBySub?: string | null,
          status?: string | null,
          dateStart?: string | null,
          dateEnd?: string | null,
          returnDateTime?: string | null,
        } | null > | null,
      } | null,
      accessRestriction?: string | null,
      accessRestrictionSelection?:  {
        __typename: "Administration",
        arbetsmarknadsforvaltningen?: boolean | null,
        fastighetsforvaltningen?: boolean | null,
        kulturforvaltningen?: boolean | null,
        miljoforvaltningen?: boolean | null,
        skolOchFritidsforvaltningen?: boolean | null,
        socialforvaltningen?: boolean | null,
        stadsbyggnadsforvaltningen?: boolean | null,
        stadsledningsforvaltningen?: boolean | null,
        vardOchOmsorgsforvaltningen?: boolean | null,
      } | null,
      address?: string | null,
      city?: string | null,
      postalCode?: string | null,
      missingAccessories?:  Array< {
        __typename: "MissingAccessories",
        reportedBy: string,
        reportedDate: string,
        accessories: Array< string | null >,
        lastReturnedBy: string,
      } | null > | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type GetPageQueryVariables = {
  slug: string,
};

export type GetPageQuery = {
  getPage?:  {
    __typename: "Page",
    id: string,
    slug: string,
    title: string,
    content?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListPagesQueryVariables = {
  slug?: string | null,
  filter?: ModelPageFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  sortDirection?: ModelSortDirection | null,
};

export type ListPagesQuery = {
  listPages?:  {
    __typename: "ModelPageConnection",
    items:  Array< {
      __typename: "Page",
      id: string,
      slug: string,
      title: string,
      content?: string | null,
      createdAt: string,
      updatedAt: string,
    } | null >,
    nextToken?: string | null,
  } | null,
};

export type OnCreateAdvertSubscription = {
  onCreateAdvert?:  {
    __typename: "Advert",
    id: string,
    title: string,
    description?: string | null,
    height?: string | null,
    width?: string | null,
    length?: string | null,
    status?: ItemStatus | null,
    category?: string | null,
    material?:  Array< {
      __typename: "ItemAMaterial",
      wood?: boolean | null,
      plastic?: boolean | null,
      metal?: boolean | null,
      other?: boolean | null,
    } | null > | null,
    condition?: ItemCondition | null,
    color?: string | null,
    areaOfUse?:  Array< {
      __typename: "ItemAreaOfUse",
      indoors?: boolean | null,
      outside?: boolean | null,
    } | null > | null,
    images?:  Array< {
      __typename: "ItemImages",
      src?: string | null,
      alt?: string | null,
    } | null > | null,
    quantity?: number | null,
    department?: string | null,
    instructions?: string | null,
    contactPerson?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    giver?: string | null,
    version: number,
    climateImpact?: number | null,
    reservedBySub?: string | null,
    reservedByName?: string | null,
    revisions?: number | null,
    purchasePrice?: string | null,
    company?: string | null,
    aterbruketId?: string | null,
    advertType?: ItemAdvertType | null,
    missingItemsInformation?: string | null,
    pickUpInformation?: string | null,
    returnInformation?: string | null,
    pickUpInstructions?: string | null,
    accessories?: Array< string | null > | null,
    borrowDifficultyLevel?: string | null,
    advertBorrowCalendar?:  {
      __typename: "AdvertBorrowCalendar",
      allowedDateStart?: string | null,
      allowedDateEnd?: string | null,
      calendarEvents?:  Array< {
        __typename: "CalendarEvent",
        borrowedBySub?: string | null,
        status?: string | null,
        dateStart?: string | null,
        dateEnd?: string | null,
        returnDateTime?: string | null,
      } | null > | null,
    } | null,
    accessRestriction?: string | null,
    accessRestrictionSelection?:  {
      __typename: "Administration",
      arbetsmarknadsforvaltningen?: boolean | null,
      fastighetsforvaltningen?: boolean | null,
      kulturforvaltningen?: boolean | null,
      miljoforvaltningen?: boolean | null,
      skolOchFritidsforvaltningen?: boolean | null,
      socialforvaltningen?: boolean | null,
      stadsbyggnadsforvaltningen?: boolean | null,
      stadsledningsforvaltningen?: boolean | null,
      vardOchOmsorgsforvaltningen?: boolean | null,
    } | null,
    address?: string | null,
    city?: string | null,
    postalCode?: string | null,
    missingAccessories?:  Array< {
      __typename: "MissingAccessories",
      reportedBy: string,
      reportedDate: string,
      accessories: Array< string | null >,
      lastReturnedBy: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAdvertSubscription = {
  onUpdateAdvert?:  {
    __typename: "Advert",
    id: string,
    title: string,
    description?: string | null,
    height?: string | null,
    width?: string | null,
    length?: string | null,
    status?: ItemStatus | null,
    category?: string | null,
    material?:  Array< {
      __typename: "ItemAMaterial",
      wood?: boolean | null,
      plastic?: boolean | null,
      metal?: boolean | null,
      other?: boolean | null,
    } | null > | null,
    condition?: ItemCondition | null,
    color?: string | null,
    areaOfUse?:  Array< {
      __typename: "ItemAreaOfUse",
      indoors?: boolean | null,
      outside?: boolean | null,
    } | null > | null,
    images?:  Array< {
      __typename: "ItemImages",
      src?: string | null,
      alt?: string | null,
    } | null > | null,
    quantity?: number | null,
    department?: string | null,
    instructions?: string | null,
    contactPerson?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    giver?: string | null,
    version: number,
    climateImpact?: number | null,
    reservedBySub?: string | null,
    reservedByName?: string | null,
    revisions?: number | null,
    purchasePrice?: string | null,
    company?: string | null,
    aterbruketId?: string | null,
    advertType?: ItemAdvertType | null,
    missingItemsInformation?: string | null,
    pickUpInformation?: string | null,
    returnInformation?: string | null,
    pickUpInstructions?: string | null,
    accessories?: Array< string | null > | null,
    borrowDifficultyLevel?: string | null,
    advertBorrowCalendar?:  {
      __typename: "AdvertBorrowCalendar",
      allowedDateStart?: string | null,
      allowedDateEnd?: string | null,
      calendarEvents?:  Array< {
        __typename: "CalendarEvent",
        borrowedBySub?: string | null,
        status?: string | null,
        dateStart?: string | null,
        dateEnd?: string | null,
        returnDateTime?: string | null,
      } | null > | null,
    } | null,
    accessRestriction?: string | null,
    accessRestrictionSelection?:  {
      __typename: "Administration",
      arbetsmarknadsforvaltningen?: boolean | null,
      fastighetsforvaltningen?: boolean | null,
      kulturforvaltningen?: boolean | null,
      miljoforvaltningen?: boolean | null,
      skolOchFritidsforvaltningen?: boolean | null,
      socialforvaltningen?: boolean | null,
      stadsbyggnadsforvaltningen?: boolean | null,
      stadsledningsforvaltningen?: boolean | null,
      vardOchOmsorgsforvaltningen?: boolean | null,
    } | null,
    address?: string | null,
    city?: string | null,
    postalCode?: string | null,
    missingAccessories?:  Array< {
      __typename: "MissingAccessories",
      reportedBy: string,
      reportedDate: string,
      accessories: Array< string | null >,
      lastReturnedBy: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAdvertSubscription = {
  onDeleteAdvert?:  {
    __typename: "Advert",
    id: string,
    title: string,
    description?: string | null,
    height?: string | null,
    width?: string | null,
    length?: string | null,
    status?: ItemStatus | null,
    category?: string | null,
    material?:  Array< {
      __typename: "ItemAMaterial",
      wood?: boolean | null,
      plastic?: boolean | null,
      metal?: boolean | null,
      other?: boolean | null,
    } | null > | null,
    condition?: ItemCondition | null,
    color?: string | null,
    areaOfUse?:  Array< {
      __typename: "ItemAreaOfUse",
      indoors?: boolean | null,
      outside?: boolean | null,
    } | null > | null,
    images?:  Array< {
      __typename: "ItemImages",
      src?: string | null,
      alt?: string | null,
    } | null > | null,
    quantity?: number | null,
    department?: string | null,
    instructions?: string | null,
    contactPerson?: string | null,
    email?: string | null,
    phoneNumber?: string | null,
    giver?: string | null,
    version: number,
    climateImpact?: number | null,
    reservedBySub?: string | null,
    reservedByName?: string | null,
    revisions?: number | null,
    purchasePrice?: string | null,
    company?: string | null,
    aterbruketId?: string | null,
    advertType?: ItemAdvertType | null,
    missingItemsInformation?: string | null,
    pickUpInformation?: string | null,
    returnInformation?: string | null,
    pickUpInstructions?: string | null,
    accessories?: Array< string | null > | null,
    borrowDifficultyLevel?: string | null,
    advertBorrowCalendar?:  {
      __typename: "AdvertBorrowCalendar",
      allowedDateStart?: string | null,
      allowedDateEnd?: string | null,
      calendarEvents?:  Array< {
        __typename: "CalendarEvent",
        borrowedBySub?: string | null,
        status?: string | null,
        dateStart?: string | null,
        dateEnd?: string | null,
        returnDateTime?: string | null,
      } | null > | null,
    } | null,
    accessRestriction?: string | null,
    accessRestrictionSelection?:  {
      __typename: "Administration",
      arbetsmarknadsforvaltningen?: boolean | null,
      fastighetsforvaltningen?: boolean | null,
      kulturforvaltningen?: boolean | null,
      miljoforvaltningen?: boolean | null,
      skolOchFritidsforvaltningen?: boolean | null,
      socialforvaltningen?: boolean | null,
      stadsbyggnadsforvaltningen?: boolean | null,
      stadsledningsforvaltningen?: boolean | null,
      vardOchOmsorgsforvaltningen?: boolean | null,
    } | null,
    address?: string | null,
    city?: string | null,
    postalCode?: string | null,
    missingAccessories?:  Array< {
      __typename: "MissingAccessories",
      reportedBy: string,
      reportedDate: string,
      accessories: Array< string | null >,
      lastReturnedBy: string,
    } | null > | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnCreatePageSubscription = {
  onCreatePage?:  {
    __typename: "Page",
    id: string,
    slug: string,
    title: string,
    content?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdatePageSubscription = {
  onUpdatePage?:  {
    __typename: "Page",
    id: string,
    slug: string,
    title: string,
    content?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeletePageSubscription = {
  onDeletePage?:  {
    __typename: "Page",
    id: string,
    slug: string,
    title: string,
    content?: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};
