import React, { FC } from "react";
import styled from "styled-components";

const HeaderContainer = styled.div<IHeaderContainer>`
  margin-top: 17px;
  color: ${(props) => props.theme.colors.darkest};
  margin-left: ${({ minimizeHeader }) => (minimizeHeader ? `24px` : `0px`)};
  font-weight: ${({ minimizeHeader }) => (minimizeHeader ? 800 : 500)};
  width: ${({ minimizeHeader }) => (minimizeHeader ? `unset` : `max-content`)};
  margin-bottom: ${({ minimizeHeader }) =>
    minimizeHeader ? `revert` : `12px`};
  transform: ${({ minimizeHeader }) =>
    minimizeHeader ? "none" : "scale(0.5)"};
`;

const Subtitle = styled.div`
  font-size: 18px;
  margin-top: 0;
`;

const Title = styled.div`
  font-size: 36px;
`;

interface IHeaderContainer {
  minimizeHeader: boolean;
}

interface IProps extends IHeaderContainer {
  titel: string;
  subTitle?: string;
}

const HeaderText: FC<IProps> = ({ titel, subTitle, minimizeHeader }) => (
  <HeaderContainer minimizeHeader={minimizeHeader}>
    <Title>{titel}</Title>
    {subTitle && minimizeHeader && <Subtitle>{subTitle}</Subtitle>}
  </HeaderContainer>
);

export default HeaderText;
