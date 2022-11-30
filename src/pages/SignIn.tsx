import React, { FC } from 'react';
import { withRouter } from 'react-router-dom';
/* Import the Amplify Auth API */
import { Auth } from 'aws-amplify';
import { toast, ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import Button from '../components/Button';
import Input from '../components/Input';
import { Label } from '../components/Forms/FormLayout/FormLayout';
import HbgLogo from '../pics/HBG_logo_sm.png';
import { FormContainer } from '../components/Forms/FormLayout/styled';
import 'react-toastify/dist/ReactToastify.css';
import { localization } from '../localizations';

const Logo = styled.img`
    width: 34px;
    margin-bottom: 26px;
`;

const SubTitle = styled.h4`
    font-size: 16px;
    font-weight: 700;
    color: #205400;
    margin: 0px;
`;

const Separator = styled.div`
    width: 32px;
    height: 2px;
    margin: 16px 0;
    background-color: #e1e9db;
    border-radius: 10px;
`;

const Title = styled.h1`
    font-size: 36px;
    font-weight: 900;
    color: #000;
    margin: 0px 0px 16px 0px;
`;

const Text = styled.p`
    font-size: 16px;
    font-weight: 500;
    color: #3d3d3d;
    line-height: 27px;
    margin: 0px 0px 16px 0px;
`;

const LoginInput = styled(Input)`
    box-sizing: border-box;
    display: block;
    margin-top: 8px;
    margin-bottom: 32px;
    width: 100%;
`;

const LoginButton = styled(Button)`
    width: 100%;
`;

const formInputState = {
    username: '',
    password: '',
};

/* onChange handler for form inputs */
function onChangePassword(e: { target: HTMLInputElement }) {
    formInputState.password = e.target.value;
}

function onChangeUserName(e: { target: HTMLInputElement }) {
    formInputState.username = e.target.value.toLowerCase();
}

function getTranslation(message: string) {
    switch (message) {
        case 'Incorrect username or password.':
            return localization.wrongUsernamePassword;
        case 'Password attempts exceeded':
            return localization.passwordAttemptsExceeded;
        default:
            return message;
            break;
    }
}

async function signIn(e: React.SyntheticEvent) {
    e.preventDefault();
    try {
        await Auth.signIn(formInputState.username, formInputState.password);
    } catch (err) {
        const error = err as Error;
        toast.warn(getTranslation(error.message));
    }
}

const SignIn: FC = () => {
    return (
        <FormContainer>
            <ToastContainer />
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
                    Logga in med ditt vanliga jobbkonto — ingen registrering
                    behövs.
                </Text>
            </div>
            <form onSubmit={signIn}>
                <Label htmlFor="username">{localization.userNameText}</Label>
                <LoginInput name="username" onChange={onChangeUserName} />
                <Label>{localization.passwordText}</Label>
                <LoginInput
                    type="password"
                    name="password"
                    onChange={onChangePassword}
                />
                <LoginButton type="submit" value="submit" onClick={signIn}>
                    {localization.loginText.toUpperCase()}
                </LoginButton>
            </form>
        </FormContainer>
    );
};

export default withRouter(SignIn);
