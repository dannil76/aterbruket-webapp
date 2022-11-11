/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const searchAdverts = /* GraphQL */ `
  query SearchAdverts(
    $filter: SearchableAdvertFilterInput
    $sort: [SearchableAdvertSortInput]
    $limit: Int
    $nextToken: String
    $from: Int
    $aggregates: [SearchableAdvertAggregationInput]
  ) {
    searchAdverts(
      filter: $filter
      sort: $sort
      limit: $limit
      nextToken: $nextToken
      from: $from
      aggregates: $aggregates
    ) {
      items {
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
        returnDate
        reservationDate
        pickUpInstructions
        accessories
        borrowDifficultyLevel
        advertBorrowCalendar {
          allowedDateStart
          allowedDateEnd
          calendarEvents {
            borrowedBySub
            status
            dateStart
            dateEnd
            returnDateTime
          }
        }
        advertPickUps {
          reservedBySub
          quantity
          reservationDate
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
      nextToken
      total
      aggregateItems {
        name
        result {
          ... on SearchableAggregateScalarResult {
            value
          }
          ... on SearchableAggregateBucketResult {
            buckets {
              key
              doc_count
            }
          }
        }
      }
    }
  }
`;
export const getAdvert = /* GraphQL */ `
  query GetAdvert($id: ID!, $version: Int!) {
    getAdvert(id: $id, version: $version) {
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
      returnDate
      reservationDate
      pickUpInstructions
      accessories
      borrowDifficultyLevel
      advertBorrowCalendar {
        allowedDateStart
        allowedDateEnd
        calendarEvents {
          borrowedBySub
          status
          dateStart
          dateEnd
          returnDateTime
        }
      }
      advertPickUps {
        reservedBySub
        quantity
        reservationDate
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
export const listAdverts = /* GraphQL */ `
  query ListAdverts(
    $id: ID
    $version: ModelIntKeyConditionInput
    $filter: ModelAdvertFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listAdverts(
      id: $id
      version: $version
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
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
        returnDate
        reservationDate
        pickUpInstructions
        accessories
        borrowDifficultyLevel
        advertBorrowCalendar {
          allowedDateStart
          allowedDateEnd
          calendarEvents {
            borrowedBySub
            status
            dateStart
            dateEnd
            returnDateTime
          }
        }
        advertPickUps {
          reservedBySub
          quantity
          reservationDate
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
      nextToken
    }
  }
`;
export const getPage = /* GraphQL */ `
  query GetPage($slug: String!) {
    getPage(slug: $slug) {
      id
      slug
      title
      content
      createdAt
      updatedAt
    }
  }
`;
export const listPages = /* GraphQL */ `
  query ListPages(
    $slug: String
    $filter: ModelPageFilterInput
    $limit: Int
    $nextToken: String
    $sortDirection: ModelSortDirection
  ) {
    listPages(
      slug: $slug
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      sortDirection: $sortDirection
    ) {
      items {
        id
        slug
        title
        content
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getByStatusAndReservationDate = /* GraphQL */ `
  query GetByStatusAndReservationDate(
    $status: ItemStatus!
    $reservationDateVersion: ModelAdvertByStatusAndReservationDateAndVersionCompositeKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAdvertFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getByStatusAndReservationDate(
      status: $status
      reservationDateVersion: $reservationDateVersion
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        returnDate
        reservationDate
        pickUpInstructions
        accessories
        borrowDifficultyLevel
        advertBorrowCalendar {
          allowedDateStart
          allowedDateEnd
          calendarEvents {
            borrowedBySub
            status
            dateStart
            dateEnd
            returnDateTime
          }
        }
        advertPickUps {
          reservedBySub
          quantity
          reservationDate
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
      nextToken
    }
  }
`;
export const getByStatusAndReturnDate = /* GraphQL */ `
  query GetByStatusAndReturnDate(
    $status: ItemStatus!
    $returnDate: ModelStringKeyConditionInput
    $sortDirection: ModelSortDirection
    $filter: ModelAdvertFilterInput
    $limit: Int
    $nextToken: String
  ) {
    getByStatusAndReturnDate(
      status: $status
      returnDate: $returnDate
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
        returnDate
        reservationDate
        pickUpInstructions
        accessories
        borrowDifficultyLevel
        advertBorrowCalendar {
          allowedDateStart
          allowedDateEnd
          calendarEvents {
            borrowedBySub
            status
            dateStart
            dateEnd
            returnDateTime
          }
        }
        advertPickUps {
          reservedBySub
          quantity
          reservationDate
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
      nextToken
    }
  }
`;
