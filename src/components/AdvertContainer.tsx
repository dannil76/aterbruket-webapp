import React, { FC, Suspense } from "react";
import styled from "styled-components";
import { IOption } from "../interfaces/IForm";

const Card = React.lazy(() => import("./Card"));

type ISorting = {
  first: string;
  second: string;
  sortTitle: string;
  secText: string;
};

interface IAdvert {
  items: any;
  searchValue: any;
  itemsFrom: string;
  activeFilterOptions: IOption[];
  activeSorting: ISorting;
  fetchReservedAdverts?: any;
}

const AdvertContainerDiv = styled.div`
  width: 90%;
  max-width: 700px;
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-bottom: 15px;

  .allaDiv {
    width: 100%;
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justy h3 {
      color: #3d3d3d;
      margin: 10px;
    }
  }
`;

const OptionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  .options {
    font-weight: 900;
    font-size: 12px;
    line-height: 150%;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    text-align: center;
    letter-spacing: 0.05em;
    text-transform: uppercase;

    background-color: #e1e9db;

    color: ${(props) => props.theme.colors.primaryDark};
    border-radius: 4.5px;
  }
  h3 {
    margin: 8px;
  }
`;

const AdvertContainer: FC<IAdvert> = ({
  items,
  searchValue,
  itemsFrom,
  activeFilterOptions,
  activeSorting,
  fetchReservedAdverts,
}: IAdvert) => {
  let filteredItems = [];
  if (searchValue) {
    filteredItems = items.filter((item: any) => {
      return (
        item.title.toLowerCase().indexOf(searchValue.toLocaleLowerCase()) !==
        -1 ||
        item.description
          .toLowerCase()
          .indexOf(searchValue.toLocaleLowerCase()) !== -1 ||
        (item.aterbruketId &&
          item.aterbruketId
            .toLowerCase()
            .indexOf(searchValue.toLocaleLowerCase()) !== -1)
      );
    });
  } else {
    filteredItems = items;
  }

  return (
    <AdvertContainerDiv>
      <Suspense fallback={<div>Loading...</div>}>
        <div className="allaDiv">
          {itemsFrom === "home" && activeFilterOptions.length > 0 ? (
            <OptionWrapper>
              <h3>Aktiva filter :</h3>
              {activeFilterOptions.map((option: IOption) => {
                return (
                  <span
                    className="options"
                    key={option.key}
                    style={{ margin: "5px", height: "15px" }}
                  >
                    {option.title}
                  </span>
                );
              })}
            </OptionWrapper>
          ) : (
            itemsFrom === "home" && (
              <OptionWrapper>
                {searchValue ? (
                  <h3>
                    Sökning "{searchValue}" gav {filteredItems.length} annonser
                  </h3>
                ) : (
                  <h3>Alla möbler</h3>
                )}
              </OptionWrapper>
            )
          )}
          {itemsFrom === "home" && activeSorting.sortTitle !== "" && (
            <OptionWrapper>
              <h3>Sorterar på:</h3>
              <span
                className="options"
                style={{ margin: "5px", height: "15px" }}
              >
                {activeSorting.sortTitle}: {activeSorting.secText}
              </span>
            </OptionWrapper>
          )}
          {itemsFrom === "haffat" && items.length !== 0 && (
            <h3>Saker att hämta</h3>
          )}
          {itemsFrom === "haffat" && items.length === 0 && (
            <h3>Inga saker att hämta</h3>
          )}
          {itemsFrom === "pickedUp" && items.length !== 0 && (
            <h3>Saker som har hämtats</h3>
          )}
          {itemsFrom === "pickedUp" && items.length === 0 && (
            <h3>Inga saker har hämtats</h3>
          )}
          {itemsFrom === "myAdds" && <h3>Mina annonser</h3>}
        </div>
        {filteredItems.map((filteredItem: any) => (
          <Card
            key={filteredItem.id}
            imageKey={filteredItem.images[0].src}
            filteredItem={filteredItem}
            fetchReservedAdverts={fetchReservedAdverts}
            itemsFrom={itemsFrom}
          />
        ))}
      </Suspense>
    </AdvertContainerDiv>
  );
};
export default AdvertContainer;
