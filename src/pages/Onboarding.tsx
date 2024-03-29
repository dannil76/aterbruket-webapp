import { AuthState } from '@aws-amplify/ui-components';
import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import React, { FC, useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import SwiperCore, {
    A11y,
    Navigation,
    Pagination,
    Parallax,
    Scrollbar,
} from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import UserContext from '../contexts/UserContext';
import SignIn from './SignIn';
import BG from '../pics/onboarding_bg_x2.png';
import HbgLogo from '../pics/HBG_logo_sm.png';
import Button from '../components/Button';

SwiperCore.use([Navigation, Parallax, Pagination, Scrollbar, A11y]);

const SwipeContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
`;

const SwipeContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    max-width: 500px;
`;

const Title = styled.h1`
    font-size: 36px;
    font-weight: 900;
    color: #000;
    margin: 0px 0px 16px 0px;
`;

const SubTitle = styled.h4`
    font-size: 16px;
    font-weight: 700;
    color: #205400;
    margin: 0px;
`;

const Text = styled.p`
    font-size: 16px;
    font-weight: 500;
    color: #3d3d3d;
    line-height: 27px;
    margin: 0px 0px 16px 0px;
`;

const NextButtonWrapper = styled.div`
    display: flex;
    justify-content: flex-end;
`;

const SwiperFooterButtons = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`;

const SwiperHeaderButtons = styled.div`
    display: flex;
    align-items: flex-end;
    flex-direction: column;
`;

type BackgroundProps = {
    transparent?: boolean;
};

const Background = styled.div<BackgroundProps>`
    position: absolute;
    z-index: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    -webkit-background-size: cover;
    background-size: cover;
    background-position: center;
    background-color: #eaf0e4;
    transition: background-color 1s linear;
    ${({ transparent }) => transparent && `background-color: transparent;`}
`;

const ParallaxBackground = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    width: 500%;
    height: 100%;
    -webkit-background-size: cover;
    background-size: cover;
    background-position: center;
    background-image: url(${BG});
    background-color: transparent;
`;

const Logo = styled.img`
    width: 34px;
    margin-bottom: 26px;
`;

const Separator = styled.div`
    width: 32px;
    height: 2px;
    margin: 16px 0;
    background-color: #e1e9db;
    border-radius: 10px;
`;

const Onboarding: FC = () => {
    const [isOnboardingDisabled, setIsOnboardingDisabled] =
        useState<boolean>(false);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const { authState } = useContext(UserContext);

    const storeOnboardingVisibility = () => {
        localStorage.setItem('HaffaApp:showOnboardingScreen', 'false');
    };

    const disableOnboarding = () => {
        storeOnboardingVisibility();
        setIsOnboardingDisabled(true);
    };

    const slides = [
        <SwiperSlide key="slide1">
            <SwipeContainer>
                <SwipeContent>
                    <div data-swiper-parallax="-100">
                        <Logo src={HbgLogo} alt="Logo" />
                        <SubTitle>En delningsplattform.</SubTitle>
                        <Separator />
                    </div>
                    <div data-swiper-parallax="-200">
                        <Title>Haffa!</Title>
                    </div>
                    <div data-swiper-parallax="-300">
                        <Text>
                            För anställda i Helsingborgs stad som vill återbruka
                            och dela mera.
                        </Text>
                        <Text>
                            Vår planet klarar inte mer konsumtion av nya prylar.
                            Därför behöver vi dela mer med varandra och tänka
                            oss för innan vi köper nytt. Finns det redan en
                            begagnad stol i organisationen? Återbruka den
                            istället för att köpa en ny.
                        </Text>
                        <Text>
                            Med Haffa gör vi det enkelt att agera klimatsmart på
                            jobbet.
                        </Text>
                    </div>
                    <div data-swiper-parallax="-400">
                        <SwiperFooterButtons>
                            <Button
                                size="lg"
                                shadow
                                onClick={disableOnboarding}
                            >
                                Logga in
                            </Button>
                            <Button
                                size="lg"
                                transparent
                                className="swipe-next"
                            >
                                Läs mer
                            </Button>
                        </SwiperFooterButtons>
                    </div>
                </SwipeContent>
            </SwipeContainer>
        </SwiperSlide>,
        <SwiperSlide key="slide2">
            <SwipeContainer>
                <SwipeContent>
                    <div data-swiper-parallax="-100">
                        <SwiperHeaderButtons>
                            <Button
                                size="sm"
                                secondary
                                onClick={disableOnboarding}
                            >
                                HOPPA ÖVER
                            </Button>
                        </SwiperHeaderButtons>
                        <Logo src={HbgLogo} alt="Logo" />
                        <SubTitle>Haffa! En delningsplattform.</SubTitle>
                        <Separator />
                    </div>
                    <div data-swiper-parallax="-200">
                        <Title>Återbruka möbler</Title>
                    </div>
                    <div data-swiper-parallax="-300">
                        <Text>
                            Med återbruket kan du haffa begagnade möbler
                            istället för att köpa nya.{' '}
                        </Text>
                        <Text>
                            Möblerna finns antingen i Återbrukets lokaler på
                            Larmvägen 33 eller runt om i förvaltningarna.
                        </Text>
                        <Text>
                            Ser du något du vill ha? Haffa möbeln och ta kontakt
                            via annonsen, och kom överens om när och hur möbeln
                            hämtas.
                        </Text>
                    </div>
                    <div data-swiper-parallax="-400">
                        <NextButtonWrapper>
                            <Button size="md" className="swipe-next">
                                Fortsätt
                            </Button>
                        </NextButtonWrapper>
                    </div>
                </SwipeContent>
            </SwipeContainer>
        </SwiperSlide>,
        <SwiperSlide key="slide3">
            <SwipeContainer>
                <SwipeContent>
                    <div data-swiper-parallax="-100">
                        <SwiperHeaderButtons>
                            <Button
                                size="sm"
                                secondary
                                onClick={disableOnboarding}
                            >
                                HOPPA ÖVER
                            </Button>
                        </SwiperHeaderButtons>
                        <Logo src={HbgLogo} alt="Logo" />
                        <SubTitle>Haffa! En delningsplattform.</SubTitle>
                        <Separator />
                    </div>
                    <div data-swiper-parallax="-200">
                        <Title>Låna istället för att köpa nytt</Title>
                    </div>
                    <div data-swiper-parallax="-300">
                        <Text>
                            Varför ska alla ha sin egen laminator, skruvdragare,
                            videokamera eller sparkcykel? Ofta har vi köpt in
                            prylar som inte används hela tiden. Lika ofta köper
                            vi identiska prylar på olika håll i organisationen.
                            Dumt, eller hur? Låt oss dela mer!
                        </Text>
                        <Text>
                            Med Haffa kan du enkelt hitta prylen du behöver låna
                            istället för att din skola, enhet eller avdelning
                            skall behöva köpa in nytt.
                        </Text>
                    </div>
                    <div data-swiper-parallax="-400">
                        <NextButtonWrapper>
                            <Button size="md" className="swipe-next">
                                Fortsätt
                            </Button>
                        </NextButtonWrapper>
                    </div>
                </SwipeContent>
            </SwipeContainer>
        </SwiperSlide>,
        <SwiperSlide key="slide4">
            <SwipeContainer>
                <SwipeContent>
                    <div data-swiper-parallax="-100">
                        <SwiperHeaderButtons>
                            <Button
                                size="sm"
                                secondary
                                onClick={disableOnboarding}
                            >
                                HOPPA ÖVER
                            </Button>
                        </SwiperHeaderButtons>
                        <Logo src={HbgLogo} alt="Logo" />
                        <SubTitle>Haffa! En delningsplattform.</SubTitle>
                        <Separator />
                    </div>
                    <div data-swiper-parallax="-200">
                        <Title>Dela din pryl med en kollega</Title>
                    </div>
                    <div data-swiper-parallax="-300">
                        <Text>
                            Har du eller din avdelning saker som skulle kunna
                            användas av flera?
                        </Text>
                        <Text>
                            Lägg in dem här så blir det superenkelt för dina
                            kollegor att själva låna prylarna.
                        </Text>
                        <Text>
                            Med Haffa genererar du enkelt en QR-kod som du
                            klistrar på din pryl och den som lånar kan enkelt
                            skanna koden med sin telefon för att låna eller
                            lämna tillbaka.{' '}
                        </Text>
                    </div>
                    <div data-swiper-parallax="-400">
                        <NextButtonWrapper>
                            <Button size="md" className="swipe-next">
                                Fortsätt
                            </Button>
                        </NextButtonWrapper>
                    </div>
                </SwipeContent>
            </SwipeContainer>
        </SwiperSlide>,
        <SwiperSlide key="slide5">
            <SwipeContainer>
                <SwipeContent>
                    <div data-swiper-parallax="-100">
                        <SwiperHeaderButtons>
                            <Button
                                size="sm"
                                secondary
                                onClick={disableOnboarding}
                            >
                                HOPPA ÖVER
                            </Button>
                        </SwiperHeaderButtons>
                        <Logo src={HbgLogo} alt="Logo" />
                        <SubTitle>Haffa! En delningsplattform.</SubTitle>
                        <Separator />
                    </div>
                    <div data-swiper-parallax="-200">
                        <Title>Ju mer vi delar desto bättre</Title>
                    </div>
                    <div data-swiper-parallax="-300">
                        <Text>
                            En app räddar inte världen. Men ett förändrat
                            beteende kan betyda mycket! Ju mer vi delar med
                            varandra i organisationen, desto smartare hushåller
                            vi med planetens resurser.
                        </Text>
                        <Text>
                            Med haffa blir det enklare att vara en klimathjälte
                            på jobbet.
                        </Text>
                        <Text>Häng med och bidra du också!</Text>
                    </div>
                    <div data-swiper-parallax="-400">
                        <NextButtonWrapper>
                            <Button
                                size="md"
                                className="swipe-next"
                                onClick={() => storeOnboardingVisibility()}
                            >
                                Fortsätt
                            </Button>
                        </NextButtonWrapper>
                    </div>
                </SwipeContent>
            </SwipeContainer>
        </SwiperSlide>,
        <SwiperSlide key="slide6">
            <SwipeContainer>
                <SwipeContent>
                    <AmplifyAuthenticator>
                        <div slot="sign-in">
                            <SignIn />
                        </div>
                    </AmplifyAuthenticator>
                </SwipeContent>
            </SwipeContainer>
        </SwiperSlide>,
    ];

    if (authState === AuthState.SignedIn || isOnboardingDisabled) {
        return <Redirect to="app" />;
    }

    return (
        <Swiper
            parallax
            speed={800}
            navigation={{
                nextEl: '.swipe-next',
            }}
            spaceBetween={50}
            slidesPerView={1}
            onSlideChange={(swiper) => {
                setActiveIndex(swiper.activeIndex);
            }}
            style={{ height: '100vh' }}
        >
            <Background transparent={activeIndex === 0 || activeIndex === 5} />
            <ParallaxBackground data-swiper-parallax="-80%" />
            {slides}
        </Swiper>
    );
};

export default Onboarding;
