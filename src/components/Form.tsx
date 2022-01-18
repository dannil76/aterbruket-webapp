/* eslint-disable react/no-unused-prop-types */
/* eslint-disable array-callback-return */
/* eslint-disable consistent-return */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ToastContainer } from "react-toastify";
import { IFields, IOption } from "../interfaces/IForm";
import Button from "./Button";
import Input from "./Input";
import "react-toastify/dist/ReactToastify.css";
import compare from "../utils/compare";
import DateRangePicker from "./DateRangePicker";
import RepeaterField from "./RepeaterField";

const FormContainerDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 60px;

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: ${(props) => props.theme.colors.white};
  }

  section {
    background-color: ${(props) => props.theme.colors.white};
    width: 90%;
    height: auto;
    border-radius: 4.5px;
    padding: 4px 16px 4px 16px;
    margin: 8px 0px;
    label {
      display: flex;
    }
    .labelP {
      color: ${(props) => props.theme.colors.primary};
      letter-spacing: 0.005em;
      padding-bottom: 2px;
      font-style: normal;
      font-weight: 900;
      font-size: 14px;
      line-height: 150%;
      text-transform: uppercase;
      margin: 0;
    }
    span {
      margin-left: 3px;
      color: ${(props) => props.theme.colors.darkest};
    }

    .validationInfo {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 5px;

      .infoSpan {
        color: grey;
        font-style: italic;
        font-size: 14px;
      }
    }
  }
  .checkboxDiv {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    background-color: ${(props) => props.theme.colors.grayLighter};
    border-radius: 4.5px;
    height: 56px;
    align-items: center;

    .labelP {
      color: ${(props) => props.theme.colors.darker};
      text-transform: none;
    }
  }
  .areaOfUseDiv {
    flex-direction: column;
    align-items: flex-start;
    height: 116px;

    div {
      display: flex;
      flex-direction: row-reverse;
      justify-content: flex-end;
      padding: 0 0 0 12px;

      .labelP {
        margin: 0 0 0 4px;
      }
    }
  }

  .allDiv {
    display: flex;
    //align-items: center;
    justify-content: space-around;
    flex-direction: column;

    h4 {
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 112%;
      color: ${(props) => props.theme.colors.darkest};
    }

    textarea,
    select {
      border-radius: 4.5px;
      border: none;
      font-size: 16px;
      height: 56px;
      padding: 0 0 0 24px;
      background-color: ${(props) => props.theme.colors.grayLighter};
      ::placeholder {
        font-style: italic;
        color: #a3a3a3;
      }
    }

    textarea {
      padding: 16px 0 0 24px;
      height: 192px;
      ::placeholder {
        font-family: "Roboto";
        color: #a3a3a3;
      }
    }
    select:invalid {
      font-style: italic;
      color: #a3a3a3;
    }

    input[type="radio"] {
      height: auto;
    }
  }

  .dimensionsDiv {
    position: relative;
    height: 56px;
    margin: 12px 0 0 0;
    input {
      text-align: right;
      padding: 0 10px 0 24px;
    }
    h4 {
      color: ${(props) => props.theme.colors.primary};
      position: absolute;
      margin: 0;
      top: -17px;
      font-style: normal;
      font-weight: 900;
      font-size: 14px;
      line-height: 150%;
      text-transform: uppercase;
    }

    .labelP {
      position: absolute;
      top: 50%;
      left: 40px;
      transform: translate(0, -50%);
      font-style: normal;
      font-weight: bold;
      text-transform: none;

      color: ${(props) => props.theme.colors.darkest};
    }
  }

  input[type="file"] {
    white-space: break-spaces;
    padding: 0;
    background: transparent;
    height: 80px;

    ::-webkit-file-upload-button {
      background: ${(props) => props.theme.colors.grayLighter};
      color: black;
      width: 100%;
      height: 56px;
      border: none;
      padding: 3px;
      font-weight: 500;
      font-size: 18px;
      margin-bottom: 3px;
    }
  }
`;

const ActionsContainer = styled.div`
  margin: 32px 0;
  display: flex;
  flex-direction: column;
`;

export default function Form(props: {
  values: any;
  fields: IFields[];
  mutation: string;
  handleInputChange: (event: React.ChangeEvent<any>) => void;
  handleCheckboxChange: (event: React.ChangeEvent<any>, data: any) => void;
  handleSetValue: (value: string | string[], key: string) => void;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
}) {
  const fields = props.fields.map((field: IFields) => {
    if (field.conditions !== undefined) {
      let isVisible = true;

      field.conditions.forEach((condition: any) => {
        const { field: fieldName, value, operator } = condition;
        isVisible =
          compare(value, operator, props.values[fieldName]) && isVisible;
      });

      if (!isVisible) {
        return;
      }
    }

    const dimensions = ["width", "height", "length"];

    if (field.fieldType === "input" && field.dataType !== "checkbox") {
      const attributes: any = {
        type: field.dataType,
        name: field.name,
        onChange: props.handleInputChange,
        disabled: field.disabled,
        required: field.required,
        placeholder: field.placeholder,
      };

      if (props.values[field.name] !== undefined) {
        attributes.value = props.values[field.name];
      }
      if (field.name === "title") {
        attributes.maxLength = "20";
      }
      if (
        dimensions.includes(field.name) ||
        field.name === "phoneNumber" ||
        field.name === "purchasePrice"
      ) {
        attributes.pattern = "[0-9]*";
      }

      return (
        <section
          className={
            dimensions.includes(field.name) ? "allDiv dimensionsDiv" : "allDiv"
          }
          style={{ marginTop: field.title === "Höjd" ? "24px" : "12px" }}
          key={field.name}
        >
          {field.title === "Färg" && <h4>Beskriv prylen</h4>}
          {field.title === "Förvaltning" && <h4>Var finns prylen?</h4>}
          {field.title === "Kontaktperson" && <h4>Kontakt</h4>}
          {field.title === "Höjd" && <h4>Mått</h4>}
          {field.name === "pickUpInstructions" && <h4>Haffningen</h4>}

          <label htmlFor={field.name}>
            <p className="labelP">{field.title}</p>
            {field.required && <span className="required">*</span>}
          </label>
          <Input {...attributes} />

          {field.description && (
            <div className="validationInfo">
              <span className="infoSpan">{field.description}</span>
            </div>
          )}
        </section>
      );
    }

    if (field.fieldType === "input" && field.dataType === "checkbox") {
      const data = field.options ? field.options : [];
      const checkboxInput = data.map((option: IOption) => {
        return (
          <div key={option.id}>
            <label htmlFor={option.key}>
              <p className="labelP">{option.title}</p>
            </label>
            <input
              type={field.dataType}
              name={option.key}
              id={option.key}
              onChange={(e) => props.handleCheckboxChange(e, field.name)}
              checked={props.values[field.name][option.key]}
              disabled={option.disabled}
            />
          </div>
        );
      });
      return (
        <section key={field.name}>
          <label htmlFor={field.name}>
            <p className="labelP">{field.title}</p>{" "}
            {field.required && <span className="required">*</span>}
          </label>

          <div
            className={
              field.title === "Användningsområde"
                ? "checkboxDiv areaOfUseDiv"
                : "checkboxDiv"
            }
          >
            {checkboxInput}
          </div>
          {field.description && (
            <div className="validationInfo">
              <span className="infoSpan">{field.description}</span>
            </div>
          )}
        </section>
      );
    }

    if (field.fieldType === "textarea") {
      return (
        <section className="allDiv" key={field.name}>
          <label htmlFor={field.name}>
            <p className="labelP">{field.title}</p>
            {field.required && <span className="required">*</span>}
          </label>
          <textarea
            name={field.name}
            onChange={props.handleInputChange}
            value={props.values[field.name]}
            placeholder={field.placeholder}
            required={field.required}
            maxLength={200}
          />
          {field.description && (
            <div className="validationInfo">
              <span className="infoSpan">{field.description}</span>
            </div>
          )}
        </section>
      );
    }

    if (field.fieldType === "select") {
      const data = field.options ? field.options : [];
      return (
        <section className="allDiv" key={field.name}>
          {" "}
          <label htmlFor={field.name} key={field.name}>
            <p className="labelP">{field.title}</p>{" "}
            {field.required && <span className="required">*</span>}
          </label>{" "}
          <select
            name={field.name}
            id={field.name}
            onChange={props.handleInputChange}
            defaultValue={
              props.values[field.name] ? props.values[field.name] : ""
            }
            required={field.required}
          >
            <option value="" disabled>
              Välj ett alternativ
            </option>
            {data.map((option: IOption) => {
              return (
                <option value={option.key} key={option.id}>
                  {option.title}
                </option>
              );
            })}
          </select>
          {field.description && (
            <div className="validationInfo">
              <span className="infoSpan">{field.description}</span>
            </div>
          )}
        </section>
      );
    }

    if (field.fieldType === "radio") {
      const data = field.options ? field.options : [];
      const options = data.map((option: IOption) => (
        <div key={option.id}>
          <label htmlFor={option.key}>
            <p className="labelP">{option.title}</p>
          </label>
          <input
            type="radio"
            id={option.key}
            name={field.name}
            value={option.key}
            checked={props.values[field.name] == option.key}
            onChange={props.handleInputChange}
          />
        </div>
      ));
      return (
        <section className="allDiv" key={field.name}>
          <label htmlFor={field.name}>
            <p className="labelP">{field.title}</p>{" "}
            {field.required && <span className="required">*</span>}
          </label>

          <div className="checkboxDiv areaOfUseDiv">{options}</div>
        </section>
      );
    }

    if (field.fieldType === "dateRangePicker") {
      return (
        <section className="allDiv" key={field.name}>
          <label htmlFor={field.name}>
            <p className="labelP">{field.title}</p>{" "}
            {field.required && <span className="required">*</span>}
          </label>
          <DateRangePicker />
        </section>
      );
    }

    if (field.fieldType === "repeater") {
      return (
        <section className="allDiv" key={field.name}>
          <label htmlFor={field.name}>
            <p className="labelP">{field.title}</p>
            {field.required && <span className="required">*</span>}
          </label>

          <RepeaterField
            setData={(value) => props.handleSetValue(value, field.name)}
            data={props.values[field.name]}
          >
            {props.values[field.name].length > 0 && (
              <RepeaterField.ItemsContainer>
                {props.values[field.name].map((item: any, index: number) => (
                  <RepeaterField.Item key={`${item}${index}`} value={item} />
                ))}
              </RepeaterField.ItemsContainer>
            )}
            <RepeaterField.Input placeholder="Nytt tillbehör" />
          </RepeaterField>

          {field.description && (
            <div className="validationInfo">
              <span className="infoSpan">{field.description}</span>
            </div>
          )}
        </section>
      );
    }

    if (field.fieldType === "layout") {
      return (
        <section className="allDiv" key={field.name}>
          {field.title && (
            <label htmlFor={field.name}>
              <p className="labelP">{field.title}</p>{" "}
              {field.required && <span className="required">*</span>}
            </label>
          )}
          <div>
            <p>{field.attributes?.content}</p>
          </div>
        </section>
      );
    }
  });

  const history = useHistory();

  const goBackFunc = () => {
    history.goBack();
  };

  return (
    <FormContainerDiv>
      <form onSubmit={props.handleSubmit}>
        {fields}
        <ActionsContainer>
          <Button
            type="submit"
            style={{
              width: "350px",
              height: "56px",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            Färdig!
          </Button>
          <Button
            type="button"
            onClick={() => goBackFunc()}
            transparent
            style={{
              fontSize: "16px",
              color: "#A3A3A3",
              border: "none",
              fontWeight: "bold",
            }}
          >
            Avbryt
          </Button>
        </ActionsContainer>
      </form>
      <ToastContainer
        position="top-center"
        autoClose={6000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </FormContainerDiv>
  );
}
