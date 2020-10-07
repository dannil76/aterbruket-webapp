/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateAdvertisementInput = {
  id?: string | null,
  title: string,
  description?: string | null,
};

export type ModelAdvertisementConditionInput = {
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelAdvertisementConditionInput | null > | null,
  or?: Array< ModelAdvertisementConditionInput | null > | null,
  not?: ModelAdvertisementConditionInput | null,
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

export type UpdateAdvertisementInput = {
  id: string,
  title?: string | null,
  description?: string | null,
};

export type DeleteAdvertisementInput = {
  id?: string | null,
};

export type ModelAdvertisementFilterInput = {
  id?: ModelIDInput | null,
  title?: ModelStringInput | null,
  description?: ModelStringInput | null,
  and?: Array< ModelAdvertisementFilterInput | null > | null,
  or?: Array< ModelAdvertisementFilterInput | null > | null,
  not?: ModelAdvertisementFilterInput | null,
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

export type CreateAdvertisementMutationVariables = {
  input: CreateAdvertisementInput,
  condition?: ModelAdvertisementConditionInput | null,
};

export type CreateAdvertisementMutation = {
  createAdvertisement:  {
    __typename: "Advertisement",
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type UpdateAdvertisementMutationVariables = {
  input: UpdateAdvertisementInput,
  condition?: ModelAdvertisementConditionInput | null,
};

export type UpdateAdvertisementMutation = {
  updateAdvertisement:  {
    __typename: "Advertisement",
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type DeleteAdvertisementMutationVariables = {
  input: DeleteAdvertisementInput,
  condition?: ModelAdvertisementConditionInput | null,
};

export type DeleteAdvertisementMutation = {
  deleteAdvertisement:  {
    __typename: "Advertisement",
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type GetAdvertisementQueryVariables = {
  id: string,
};

export type GetAdvertisementQuery = {
  getAdvertisement:  {
    __typename: "Advertisement",
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type ListAdvertisementsQueryVariables = {
  filter?: ModelAdvertisementFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListAdvertisementsQuery = {
  listAdvertisements:  {
    __typename: "ModelAdvertisementConnection",
    items:  Array< {
      __typename: "Advertisement",
      id: string,
      title: string,
      description: string | null,
      createdAt: string,
      updatedAt: string,
    } | null > | null,
    nextToken: string | null,
  } | null,
};

export type OnCreateAdvertisementSubscription = {
  onCreateAdvertisement:  {
    __typename: "Advertisement",
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnUpdateAdvertisementSubscription = {
  onUpdateAdvertisement:  {
    __typename: "Advertisement",
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};

export type OnDeleteAdvertisementSubscription = {
  onDeleteAdvertisement:  {
    __typename: "Advertisement",
    id: string,
    title: string,
    description: string | null,
    createdAt: string,
    updatedAt: string,
  } | null,
};