import styled from "styled-components";

const Card = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 16px;
  width: calc(100% - 32px);
  box-sizing: border-box;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 9.5px;
  box-shadow: 0px 0px 2px rgba(98, 98, 98, 0.18),
    0px 1px 2px rgba(98, 98, 98, 0.18);

  .cardHeader {
    z-index: 0;
    width: 100%;
    height: 200px;
    border-radius: 9.5px 9.5px 0px 0px;
  }

  .cardBody {
    padding: 24px;
  }

  p {
    font-size: 18px;
    margin: 0 0 12px 0;
  }

  .contactPersonDiv {
    box-sizing: border-box;
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 16px;

    h4 {
      margin: 0 16px;
      align-self: unset;
    }
    .company {
      margin: 0 16px;
    }
    .circle {
      padding: 0;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #f2f6ee;
      position: relative;
    }
    svg {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: ${(props) => props.theme.colors.illustration};
      font-size: 24px;
    }
  }
  .contactInfo {
    box-sizing: border-box;
    padding: 0 8px 0 8px;
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    background-color: #f5f5f5;
    border-radius: 4.5px;
    margin: 0 0 10px 0;
    line-break: anywhere;

    &:last-child {
      margin: 0;
    }

    a {
      color: ${(props) => props.theme.colors.darker};
      margin-left: 8px;
      text-decoration: inherit;
      color: inherit;
      :visited {
        text-decoration: inherit;
        color: inherit;
      }
    }
    svg {
      font-size: 20px;
      color: ${(props) => props.theme.colors.dark};
    }
  }
`;

export default Card;
