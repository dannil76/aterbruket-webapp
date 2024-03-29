/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAdvert = /* GraphQL */ `
  subscription OnCreateAdvert {
    onCreateAdvert {
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
export const onUpdateAdvert = /* GraphQL */ `
  subscription OnUpdateAdvert {
    onUpdateAdvert {
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
export const onDeleteAdvert = /* GraphQL */ `
  subscription OnDeleteAdvert {
    onDeleteAdvert {
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
export const onCreatePage = /* GraphQL */ `
  subscription OnCreatePage {
    onCreatePage {
      id
      slug
      title
      content
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePage = /* GraphQL */ `
  subscription OnUpdatePage {
    onUpdatePage {
      id
      slug
      title
      content
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePage = /* GraphQL */ `
  subscription OnDeletePage {
    onDeletePage {
      id
      slug
      title
      content
      createdAt
      updatedAt
    }
  }
`;
