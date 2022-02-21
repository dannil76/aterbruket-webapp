/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAdvert = /* GraphQL */ `
  query GetAdvert($id: ID!, $version: Int!) {
    getAdvert(id: $id, version: $version) {
      id
      title
      description
      height
      width
      length
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
      returnInformation
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
        }
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
        returnInformation
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
          }
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
