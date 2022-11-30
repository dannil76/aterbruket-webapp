import { AmplifyAuthenticator } from '@aws-amplify/ui-react';
import React, { FC, Suspense } from 'react';
import { Route } from 'react-router-dom';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import BG from '../pics/onboarding_bg_x2.png';
import 'react-toastify/dist/ReactToastify.min.css';

const About = React.lazy(() => import('../pages/About'));
const AddItem = React.lazy(() => import('../pages/AddItem'));
const Haffat = React.lazy(() => import('../pages/Haffat'));
const Header = React.lazy(() => import('../components/Header'));
const Home = React.lazy(() => import('../pages/Home'));
const ItemDetails = React.lazy(() => import('../pages/ItemDetails'));
const MenuBar = React.lazy(() => import('../components/MenuBar'));
const Profile = React.lazy(() => import('../pages/Profile'));
const Onboarding = React.lazy(() => import('../pages/Onboarding'));
const SignIn = React.lazy(() => import('../pages/SignIn'));
const StartScreen = React.lazy(() => import('../pages/StartScreen'));

const AppContainer = styled.div`
    min-height: ${(props) => `${props.theme.appTheme.minHeight}vh`};
    min-width: ${(props) => `${props.theme.appTheme.minWidth}px`};
    width: ${(props) => `${props.theme.appTheme.width}%`};
    padding: ${(props) =>
        `${props.theme.appTheme.padding[0]}rem ${props.theme.appTheme.padding[1]}rem ${props.theme.appTheme.padding[2]}rem ${props.theme.appTheme.padding[3]}rem`};
    box-sizing: ${(props) => props.theme.appTheme.boxSizing};
    background-color: ${(props) => props.theme.appTheme.primaryColor};
    font-family: ${(props) => props.theme.appTheme.fontFamily};
    display: flex;
    flex-direction: column;
    align-items: center;
    main {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-top: 150px;
    }
`;

const SignInWrapper = styled.div`
    display: flex;
    width: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    -webkit-background-size: cover;
    background-size: cover;
    background-position: center;
    background-image: url(${BG});
`;

const SignInContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    max-width: 500px;
`;

const AppRouter: FC = () => {
    return (
        <AmplifyAuthenticator>
            <Suspense fallback={<div>Loading...</div>}>
                <SignInWrapper slot="sign-in">
                    <SignInContent>
                        <SignIn />
                    </SignInContent>
                </SignInWrapper>
                <AppContainer>
                    <Header isHidden={false} />
                    <Route exact path="/" component={StartScreen} />
                    <Route exact path="/onboarding" component={Onboarding} />
                    <Route exact path="/app" component={() => <Home />} />
                    <Route path="/add" component={() => <AddItem />} />
                    <Route path="/haffat" component={Haffat} />
                    <Route exact path="/profile" component={Profile} />
                    <Route path="/item/:id" component={ItemDetails} />
                    <Route path="/about" component={About} />
                    <MenuBar />
                    <ToastContainer
                        position="top-center"
                        autoClose={6000}
                        hideProgressBar
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </AppContainer>
            </Suspense>
        </AmplifyAuthenticator>
    );
};

export default AppRouter;
