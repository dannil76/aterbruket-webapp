/* eslint-disable no-nested-ternary */
import React, { FC, useState, useEffect } from "react";
import styled from "styled-components";
import { useLocation, Link } from "react-router-dom";
import { RiArrowLeftSLine } from "react-icons/ri";
import { useReactPWAInstall } from "react-pwa-install";
import { useCallback } from "react";

interface MyProps {
  isInDetail: boolean;
}

const HeaderDiv = styled.header`
  width: ${(props) => `${props.theme.headerTheme.width}vw`};
  //height: ${(props) => `${props.theme.headerTheme.height}vh`};
  //height: auto;
  //display: ${(props) => props.theme.headerTheme.display};
  flex-direction: ${(props) => props.theme.headerTheme.flexDirection};
  align-items: ${(props) => props.theme.headerTheme.alignItems};
  justify-content: ${(props) => props.theme.headerTheme.justifyContent};
  padding: ${(props) =>
    `${props.theme.headerTheme.padding[0]}px ${props.theme.headerTheme.padding[1]}px ${props.theme.headerTheme.padding[2]}px ${props.theme.headerTheme.padding[3]}px`};
  background-color: ${(props) => props.theme.headerTheme.backgroundColor};
  display: ${(props: MyProps) => (props.isInDetail ? "none" : "flex")};
  position: fixed;
  z-index: 10;
  transition: all 0.2s;

  h2 {
    font-style: ${(props) => props.theme.headerTheme.fontStyle};
    font-weight: ${(props) => props.theme.headerTheme.fontWeight};
    font-size: ${(props) => `${props.theme.headerTheme.fontSize}px`};
    line-height: ${(props) => `${props.theme.headerTheme.lineHeight}%`};
    color: ${(props) => props.theme.colors.darkest};
  }
`;

const MenuLink = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  line-height: 20px;
  font-size: 20px;
  padding: 0;
  color: ${(props) => props.theme.colors.dark};
  position: absolute;
  top: 0;
  left: 12px;

  p {
    margin-left: 5px;
  }

  .icon {
    font-size: 22px;
  }
`;

const InstallButton = styled.button`
  margin: 0 auto;
`;

const Header: FC<MyProps> = () => {
  const location = useLocation();
  const path = location.pathname.slice(1);
  const subPath = location.pathname.slice(9);
  const { pwaInstall, supported, isInstalled } = useReactPWAInstall();

  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);

  const handleScroll = useCallback(() => {
    // find current scroll position
    const currentScrollPos = window.pageYOffset;

    // set state based on location info
    setVisible(
      (prevScrollPos > currentScrollPos &&
        prevScrollPos - currentScrollPos > 70) ||
        currentScrollPos < 100
    );

    // set state to new scroll position
    setPrevScrollPos(currentScrollPos);
  }, [prevScrollPos]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, visible, handleScroll]);

  useEffect(() => {
    const button: HTMLElement | null = document.getElementById("scanBtn");
    if (button) {
      if (!visible) {
        button.style.top = "6vh";
      } else {
        button.style.top = "13vh";
      }
    }
  }, [visible]);

  const handleClick = () => {
    pwaInstall({
      title: "Installera Haffa",
      description: "Haffa kommer hamna på din hemskärm som en app.",
    })
      .then()
      .catch(() => alert("Ladda gärna ner den nästa gång du använder Haffa."));
  };

  return (
    <>
      {path.includes("item") ? (
        <HeaderDiv isInDetail />
      ) : (
        <HeaderDiv
          isInDetail={false}
          style={{
            height: visible ? "auto" : "60px",
            alignItems: visible ? "flex-start" : "center",
            padding: visible ? "12px 0px 0px 24px" : "0",
          }}
        >
          {supported() && !isInstalled() && (
            <InstallButton type="button" onClick={handleClick}>
              Lägg Haffa på hemskärmen
            </InstallButton>
          )}
          {subPath === "personal-info" ||
          subPath === "myadverts" ||
          subPath === "statics" ? (
            <MenuLink to="/profile">
              <RiArrowLeftSLine className="icon" />
              <p>Meny</p>
            </MenuLink>
          ) : null}
          <h2
            style={{
              transform: visible ? "none" : "scale(0.5)",
              marginBottom: visible ? "revert" : "12px",
            }}
          >
            {subPath === "personal-info"
              ? "Kontaktuppgifter"
              : subPath === "myadverts"
              ? "Dina grejer som kan Haffas!"
              : subPath === "statics"
              ? "Haffa statistik"
              : path === "haffat"
              ? "Grejer du Haffat!"
              : path === "message"
              ? "Din Haffa-meddelanden (kommer i senare version...)"
              : "Haffa en möbel!"}
          </h2>
        </HeaderDiv>
      )}
    </>
  );
};

export default Header;
