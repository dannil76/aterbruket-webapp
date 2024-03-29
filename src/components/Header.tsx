/* eslint-disable no-nested-ternary */
import React, { FC, useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useLocation, Link, useHistory } from 'react-router-dom';
import { MdArrowBack, MdClose } from 'react-icons/md';
import { FiShare } from 'react-icons/fi';
import { useReactPWAInstall } from 'react-pwa-install';
import HeaderText from './HeaderText';

interface MyProps {
    isHidden: boolean;
    isScrollTop?: boolean;
}

const HeaderDiv = styled.header<MyProps>`
    width: ${(props) => `${props.theme.headerTheme.width}vw`};
    flex-direction: ${(props) => props.theme.headerTheme.flexDirection};
    align-items: ${(props) => props.theme.headerTheme.alignItems};
    justify-content: ${(props) => props.theme.headerTheme.justifyContent};
    padding: ${(props) =>
        `${props.theme.headerTheme.padding[0]}px ${props.theme.headerTheme.padding[1]}px ${props.theme.headerTheme.padding[2]}px ${props.theme.headerTheme.padding[3]}px`};

    background-color: ${(props) => props.theme.appTheme.primaryColor};

    ${(props) =>
        props.isScrollTop === false &&
        `
    background-color: ${props.theme.headerTheme.backgroundColor};
    box-shadow: 0px 1px 0px rgba(86, 86, 86, 0.16);
  `}

    display: ${(props) => (props.isHidden ? 'none' : 'flex')};
    position: fixed;
    z-index: 10;
    transition: all 0.2s;

    h2 {
        font-style: ${(props) => props.theme.headerTheme.fontStyle};
        font-weight: ${(props) => props.theme.headerTheme.fontWeight};
        font-size: ${(props) => `${props.theme.headerTheme.fontSize}px`};
        line-height: ${(props) => `${props.theme.headerTheme.lineHeight}%`};
        color: ${(props) => props.theme.colors.darkest};
        padding-left: 20px;
    }
    .circle {
        width: 32px;
        height: 32px;
        background: ${(props) => props.theme.colors.primaryDark};
        border-radius: 50%;
        position: absolute;
        border: none;
        top: 16px;
        right: 24px;
        svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: ${(props) => props.theme.colors.white};
            font-size: 24px;
        }
    }
`;

const MenuLink = styled(Link)`
    color: ${(props) => props.theme.colors.dark};
    position: absolute;
    top: 24px;
    left: 20px;

    .icon {
        font-size: 22px;
    }
`;

const InstallButton = styled.button`
  background-color: ${(props) => props.theme.colors.primaryLighter};
  color: ${(props) => props.theme.colors.primary};
  font-weight: 500;
  font-size: 18px;
  padding:16px, 24px, 16px, 24px
  border-radius: 4.5px;
  border: none;
  outline: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 50px;
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
                prevScrollPos - currentScrollPos > 300) ||
                currentScrollPos < 80,
        );

        // set state to new scroll position
        setPrevScrollPos(currentScrollPos);
    }, [prevScrollPos]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, [prevScrollPos, visible, handleScroll]);

    useEffect(() => {
        const button: HTMLElement | null = document.getElementById('scanBtn');

        if (button) {
            if (!visible) {
                button.style.top = '5vh';
            } else {
                button.style.top = '13vh';
            }
        }
    }, [visible]);

    const handleClick = () => {
        pwaInstall({
            title: 'Installera Haffa',
            description: 'Haffa kommer hamna på din hemskärm som en app.',
        })
            .then()
            .catch(() =>
                alert('Ladda gärna ner den nästa gång du använder Haffa.'),
            );
    };

    const history = useHistory();

    const goBackFunc = () => {
        history.goBack();
    };

    const getHeaderText = (titleSelector: string) => {
        let titleText: string;
        let subtitleText = '';

        switch (titleSelector) {
            case 'app':
                titleText = 'Haffa';
                subtitleText = 'Delning och återbruk i Helsingborgs stad';
                break;
            case 'profile':
                titleText = 'Kontaktuppgifter';
                break;
            case 'haffat':
                titleText = 'Haffat!';
                break;
            case 'add':
                titleText = 'Gör en annons!';
                break;
            case 'about':
                titleText = 'Om Haffa!';
                break;
            default:
                titleText = 'Haffa';
                break;
        }

        return (
            <HeaderText
                titel={titleText}
                subTitle={subtitleText}
                minimizeHeader={visible}
            />
        );
    };

    return (
        <>
            {path.includes('item') ? (
                <HeaderDiv isHidden />
            ) : (
                <HeaderDiv
                    isHidden={false}
                    isScrollTop={visible}
                    style={{
                        height: visible ? 'auto' : '65px',
                        alignItems: visible ? 'flex-start' : 'center',
                        padding: visible ? '15px 0px 0px 0px' : '0',
                    }}
                >
                    {path === 'app' && supported() && !isInstalled() && (
                        <InstallButton
                            type="button"
                            onClick={handleClick}
                            style={{
                                display: visible ? 'block' : 'none',
                            }}
                        >
                            <FiShare /> Lägg Haffa på hemskärmen
                        </InstallButton>
                    )}

                    {subPath === 'myadverts' || subPath === 'statics' ? (
                        <MenuLink to="/profile">
                            <MdArrowBack className="icon" />
                        </MenuLink>
                    ) : null}
                    {path === 'add' && (
                        <button
                            className="circle"
                            type="button"
                            onClick={() => goBackFunc()}
                        >
                            <MdClose />
                        </button>
                    )}
                    {getHeaderText(path)}
                </HeaderDiv>
            )}
        </>
    );
};

export default Header;
