import styled from "styled-components";

const Input = styled.input`
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
  }`;

export default Input;
