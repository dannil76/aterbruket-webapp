import styled from "styled-components";

const SubTitle = styled.h5`
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin: 0 0 12px 0;
  font-weight: 900;
  font-size: 12px;
  line-height: 150%;
  color: ${(props) => props.theme.colors.primary};

  span {
    display: inline-block;
    margin-right: 13px;
    vertical-align: middle;
  }
`;

export default SubTitle;
