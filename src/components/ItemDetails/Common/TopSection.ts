import styled from "styled-components";

const TopSection = styled.section`
  background-color: ${(props) => props.theme.colors.offWhite};
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  box-shadow: 0px 1px 0px rgba(86, 86, 86, 0.16);
  width: 100%;

  header {
    position: relative;
    width: 100%;
    height: 60px;
    position: fixed;
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
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      line-height: 132%;
      color: ${(props) => props.theme.colors.darkest};
      text-align: center;
    }
  }

  .reservedHeader {
    background-color: ${(props) => props.theme.colors.primaryLighter};

    .headerTitle--reserved {
      margin: 0;
    }

    .reservedP {
      color: ${(props) => props.theme.colors.primaryDark};
      font-size: 14px;
      margin: 0;
    }
  }

  span {
    margin-left: 24px;
    font-style: italic;
    font-weight: 500;
    font-size: 16px;
    color: ${(props) => props.theme.colors.dark};
    padding-bottom: 24px;
  }

  .titleDiv {
    width: 100%;
    h4 {
      margin: 48px 32px 12px 32px;
      font-style: normal;
      font-weight: bold;
      font-size: 18px;
      line-height: 112%;
      letter-spacing: 0.0025em;
      color: ${(props) => props.theme.colors.primaryDark};

      svg {
        vertical-align: middle;
        color: ${(props) => props.theme.colors.primaryLight};
        font-size: 24px;
      }
    }
    h1 {
      font-style: normal;
      font-weight: 900;
      font-size: 36px;
      line-height: 124%;
      margin: 8px 32px 12px 32px;
    }
    p {
      margin: 8px 32px 24px 32px;
      color: ${(props) => props.theme.colors.primaryDark};
      font-style: normal;
      font-weight: bold;
      font-size: 16px;
    }
  }
`;

export default TopSection;
