import styled from "styled-components";

const MainSection = styled.section`
  width: 100%;
  margin: 0 auto;
  padding-top: 28px;

  section {
    padding-bottom: 28px;
  }

  h4 {
    font-style: normal;
    font-weight: bold;
    font-size: 18px;
    line-height: 144%;
    margin: 0;

    color: ${(props) => props.theme.colors.primary};
  }
  .dark {
    margin: 24px 0 16px 24px;
    color: ${(props) => props.theme.colors.darkest};
    align-self: flex-start;
  }
  .description {
    box-sizing: border-box;
    margin: 0 24px;
  }

  p {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: ${(props) => props.theme.colors.darkest};
  }

  table {
    border-collapse: collapse;
    width: 100%;
    table-layout: fixed;

    td {
      padding-left: 24px;
      padding-bottom: 16px;
      border: none;
    }

    td:nth-child(2) {
      padding-right: 24px;
      font-style: normal;
      font-weight: 500;
      font-size: 18px;
      text-align: right;
      word-wrap: break-word;

      span {
        color: ${(props) => props.theme.colors.dark};
      }
    }
  }
`;

export default MainSection;
