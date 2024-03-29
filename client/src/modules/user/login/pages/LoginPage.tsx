import React from 'react';
import { Redirect } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { State } from '../../../../shared/state/store';
import { FacebookProvider, Login } from 'react-facebook';
import { LoginProfile, LoginProfileFailure } from '../../state/profile.action';
import { Button, Col, Row } from 'antd';
import { FacebookAuthResponse } from '../../../../shared/auth/facebook/facebook.types';
import environment from '../../../../shared/environment';
import PageLoader from '../../../../shared/components/page-loader/PageLoader';
const FacebookLogin: React.FC<{
    appId: string;
    scope: string;
    onCompleted: (result: FacebookAuthResponse) => any;
    onError: (err) => any;
}> = props => {
    return (
        <FacebookProvider appId={props.appId}>
            <Login
                scope={props.scope}
                onCompleted={props.onCompleted}
                onError={props.onError}
            >
                {({ loading, handleClick, error, data }) => (
                    <span onClick={handleClick}>
                        {!loading && (
                            <Row>
                                <Col span={16} offset={4}>
                                    <Button
                                        icon="facebook"
                                        color="primary"
                                        style={{ width: '100%' }}
                                    >
                                        Autentifica-te cu Facebook
                        </Button>
                                </Col>
                            </Row>
                        )}
                        {loading && (
                            <Row>
                                <Col span={16} offset={4}>
                                    <Button
                                        loading={true}
                                        color="primary"
                                        icon="facebook"
                                        style={{ width: '100%' }}
                                    >
                                        Verificam profilul...
                                    </Button>
                                </Col>
                            </Row>
                        )}
                    </span>
                )}
            </Login>
        </FacebookProvider>
    );
};

const LoginPage: React.FC = () => {
    const { loading } = useSelector((state: State) => state.profile);
    const dispatch = useDispatch();

    if (loading) {
        return <PageLoader />;
    }

    return (
        <FacebookLogin
            appId={environment.facebookAppId}
            scope="email"
            onError={() => dispatch({ ...new LoginProfileFailure() })}
            onCompleted={result => dispatch({ ...new LoginProfile(result) })}
        />
    );
}


export default LoginPage;
