/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAdvert = /* GraphQL */ `
  mutation CreateAdvert(
    $input: CreateAdvertInput!
    $condition: ModelAdvertConditionInput
  ) {
    createAdvert(input: $input, condition: $condition) {
      id
      title
      description
      height
      width
      length
      borrowStatus
      status
      category
      material {
        wood
        plastic
        metal
        other
      }
      condition
      conditionValue
      color
      areaOfUse {
        indoors
        outside
      }
      images {
        src
        alt
      }
      quantity
      quantityUnit
      department
      instructions
      contactPerson
      email
      phoneNumber
      giver
      version
      climateImpact
      reservedBySub
      reservedByName
      revisions
      purchasePrice
      company
      aterbruketId
      advertType
      missingItemsInformation
      pickUpInformation
      lockerCodeInformation
      lockerCode
      returnInformation
      reservationDate
      pickUpInstructions
      accessories
      borrowDifficultyLevel
      toPickUpBySubs
      pickedUpBySubs
      advertBorrowCalendar {
        allowedDateStart
        allowedDateEnd
        calendarEvents {
          borrowedBySub
          status
          dateStart
          dateEnd
          returnDateTime
          quantity
        }
      }
      advertPickUps {
        reservedBySub
        quantity
        reservationDate
        pickedUp
      }
      accessRestriction
      accessRestrictionSelection {
        arbetsmarknadsforvaltningen
        fastighetsforvaltningen
        kulturforvaltningen
        miljoforvaltningen
        skolOchFritidsforvaltningen
        socialforvaltningen
        stadsbyggnadsforvaltningen
        stadsledningsforvaltningen
        vardOchOmsorgsforvaltningen
      }
      address
      city
      postalCode
      missingAccessories {
        reportedBy
        reportedDate
        accessories
        lastReturnedBy
      }
      createdAt
      updatedAt
    }
  }
`;
export const updateAdvert = /* GraphQL */ `
  mutation UpdateAdvert(
    $input: UpdateAdvertInput!
    $condition: ModelAdvertConditionInput
  ) {
    updateAdvert(input: $input, condition: $condition) {
      id
      title
      description
      height
      width
      length
      borrowStatus
      status
      category
      material {
        wood
        plastic
        metal
        other
      }
      condition
      conditionValue
      color
      areaOfUse {
        indoors
        outside
      }
      images {
        src
        alt
      }
      quantity
      quantityUnit
      department
      instructions
      contactPerson
      email
      phoneNumber
      giver
      version
      climateImpact
      reservedBySub
      reservedByName
      revisions
      purchasePrice
      company
      aterbruketId
      advertType
      missingItemsInformation
      pickUpInformation
      lockerCodeInformation
      lockerCode
      returnInformation
      reservationDate
      pickUpInstructions
      accessories
      borrowDifficultyLevel
      toPickUpBySubs
      pickedUpBySubs
      advertBorrowCalendar {
        allowedDateStart
        allowedDateEnd
        calendarEvents {
          borrowedBySub
          status
          dateStart
          dateEnd
          returnDateTime
          quantity
        }
      }
      advertPickUps {
        reservedBySub
        quantity
        reservationDate
        pickedUp
      }
      accessRestriction
      accessRestrictionSelection {
        arbetsmarknadsforvaltningen
        fastighetsforvaltningen
        kulturforvaltningen
        miljoforvaltningen
        skolOchFritidsforvaltningen
        socialforvaltningen
        stadsbyggnadsforvaltningen
        stadsledningsforvaltningen
        vardOchOmsorgsforvaltningen
      }
      address
      city
      postalCode
      missingAccessories {
        reportedBy
        reportedDate
        accessories
        lastReturnedBy
      }
      createdAt
      updatedAt
    }
  }
`;
export const deleteAdvert = /* GraphQL */ `
  mutation DeleteAdvert(
    $input: DeleteAdvertInput!
    $condition: ModelAdvertConditionInput
  ) {
    deleteAdvert(input: $input, condition: $condition) {
      id
      title
      description
      height
      width
      length
      borrowStatus
      status
      category
      material {
        wood
        plastic
        metal
        other
      }
      condition
      conditionValue
      color
      areaOfUse {
        indoors
        outside
      }
      images {
        src
        alt
      }
      quantity
      quantityUnit
      department
      instructions
      contactPerson
      email
      phoneNumber
      giver
      version
      climateImpact
      reservedBySub
      reservedByName
      revisions
      purchasePrice
      company
      aterbruketId
      advertType
      missingItemsInformation
      pickUpInformation
      lockerCodeInformation
      lockerCode
      returnInformation
      reservationDate
      pickUpInstructions
      accessories
      borrowDifficultyLevel
      toPickUpBySubs
      pickedUpBySubs
      advertBorrowCalendar {
        allowedDateStart
        allowedDateEnd
        calendarEvents {
          borrowedBySub
          status
          dateStart
          dateEnd
          returnDateTime
          quantity
        }
      }
      advertPickUps {
        reservedBySub
        quantity
        reservationDate
        pickedUp
      }
      accessRestriction
      accessRestrictionSelection {
        arbetsmarknadsforvaltningen
        fastighetsforvaltningen
        kulturforvaltningen
        miljoforvaltningen
        skolOchFritidsforvaltningen
        socialforvaltningen
        stadsbyggnadsforvaltningen
        stadsledningsforvaltningen
        vardOchOmsorgsforvaltningen
      }
      address
      city
      postalCode
      missingAccessories {
        reportedBy
        reportedDate
        accessories
        lastReturnedBy
      }
      createdAt
      updatedAt
    }
  }
`;
export const createPage = /* GraphQL */ `
  mutation CreatePage(
    $input: CreatePageInput!
    $condition: ModelPageConditionInput
  ) {
    createPage(input: $input, condition: $condition) {
      id
      slug
      title
      content
      createdAt
      updatedAt
    }
  }
`;
export const updatePage = /* GraphQL */ `
  mutation UpdatePage(
    $input: UpdatePageInput!
    $condition: ModelPageConditionInput
  ) {
    updatePage(input: $input, condition: $condition) {
      id
      slug
      title
      content
      createdAt
      updatedAt
    }
  }
`;
export const deletePage = /* GraphQL */ `
  mutation DeletePage(
    $input: DeletePageInput!
    $condition: ModelPageConditionInput
  ) {
    deletePage(input: $input, condition: $condition) {
      id
      slug
      title
      content
      createdAt
      updatedAt
    }
  }
`;
