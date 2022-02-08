import styled from "styled-components";

interface IHeader {
  reserved?: boolean;
}

const Header = styled.div<IHeader>`
    margin: 0;
    position: fixed;
    width: 100%;
    height: 60px;
    background-color: ${(props) => props.theme.colors.offWhite};
    z-index: 1000;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 1px 0px rgba(86, 86, 86, 0.16);

    svg {
      position: absolute;
      left: 28px;
      font-size: 24px;
      color: ${(props) => props.theme.colors.darkest};
    }

    p,
    .headerTitle {
      margin: 0;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 132%;
      color: ${(props) => props.theme.colors.darkest};
      text-align: center;
    }
  }

  ${(props) =>
    props.reserved &&
    `
    background-color: ${props.theme.colors.primaryLighter};

    .reservedP {
      color: ${props.theme.colors.primaryDark};
      font-size: 14px;
      margin: 0;
    }
  `}
`;

export default Header;
