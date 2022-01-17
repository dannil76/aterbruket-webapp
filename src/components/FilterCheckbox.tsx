import React, { FC } from "react";
import styled from "styled-components";
import { IOption } from "../interfaces/IForm";

const InputGroup = styled.div`
   {
    color: ${(props) => props.theme.colors.dark};
    font-weight: 500;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    background-color: ${(props) => props.theme.colors.grayLighter};
    width: 350px;
    height: 56px;
    border-radius: 4.5px;
    margin: 16px 0px 16px 0px;

    input {
      appearance: none;
      border: 2px solid ${(props) => props.theme.colors.illustration};
      border-radius: 4px;

      width: 18px;
      height: 18px;
      margin: 19px;
    }

    input[type="checkbox"]:checked,
    &:focus {
      border: 2px solid ${(props) => props.theme.colors.grayLighter};
      background-color: ${(props) => props.theme.colors.primaryLight};
      outline: none;
    }

    label {
      font-weight: 500;
      width: 100%;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    input[type="checkbox"]:checked + label,
    &:focus {
      font-weight: 900;
      color: ${(props) => props.theme.colors.darker};
    }

    }
  }
`;

const Divider = styled.div`
   {
    width: 71px;
    height: 2px;
    margin-top: 15px;
    background-color: ${(props) => props.theme.colors.primaryLighter};
  }
`;

const GroupCtn = styled.div`
   {
    width: 350px;
    height: 100%;
    margin-bottom: 3px;

    h2 {
      font-size: 12px;
      font-weight: 900;
      color: ${(props) => props.theme.colors.darker};
      margin-block-end: 0;
      letter-spacing: 0.5px;
    }
  }
`;

interface Props {
  id: string;
  title: string;
  options: IOption[];
  saveValues: any;
  setSaveValues: any;
}

const FilterCheckbox: FC<Props> = ({
  setSaveValues,
  saveValues,
  options,
  title,
  id,
}: Props) => {
  const handleInputChange = (groupName: any, e: React.ChangeEvent<any>) => {
    setSaveValues({
      ...saveValues,
      [groupName]: {
        ...saveValues[groupName],
        [e.target.name]: e.target.checked,
      },
    });
  };

  const checkboxes = options.map((element: IOption) => {
    return (
      <InputGroup key={element.id}>
        <label
          htmlFor={element.key}
          className={
            saveValues[id] && saveValues[id][element.key] ? "active" : "normal"
          }
        >
          <input
            type="checkbox"
            id={`${element.id}`}
            name={element.key}
            onChange={(e) => handleInputChange(id, e)}
            checked={!!(saveValues[id] && saveValues[id][element.key])}
          />

          {element.title}
        </label>
      </InputGroup>
    );
  });

  return (
    <GroupCtn>
      <h2>{title.toUpperCase()}</h2>
      <Divider
        style={{
          width: title === "Skick" ? "37px" : "92px",
        }}
      />
      {checkboxes}
    </GroupCtn>
  );
};

export default FilterCheckbox;
