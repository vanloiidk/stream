import React,{Component} from 'react'
import styled from 'styled-components'
import {bodyColor, borderColor, containerMaxWidth, headerHeight} from "./theme";
import userAvatar from '../images/avatar.png';
import Watch from './pages/watch';
import Home from './pages/home';
import {Route,Switch} from 'react-router-dom';
import Register from "./pages/user/register";
import Store from "../store";
import Login from "./pages/user/login";

const AppWrapper = styled.div`


`;

const Header = styled.div`
    height: ${headerHeight}px;
    border-bottom:1px solid ${borderColor};


`;

const Main = styled.div`
    padding: 20px 0;
    

`;

const Footer = styled.div`
    border-top: 1px solid ${borderColor};
    padding: 10px 0px;
`;
const Container = styled.div`
    max-width: ${containerMaxWidth}px;
    margin: 0 auto;
`;
const Copyright = styled.p`
    font-size: 12px;
    text-align: center;

`;
const HeaderTitle = styled.div`
    font-size: 30px;
    font-weight: 800;
    line-height:${headerHeight}px;
    flex-grow: 1;
    text-align: center;
    color: rgba(0,0,0,0.8);

`;
const HeaderUserMenu = styled.div`
    width: 50px;
    display: flex;
    align-items:center;

`;
const HeaderWrapper = styled.div`
    display: flex;
`;
const HeaderUserAvatar = styled.img`
    border-radius: 50px;
    width: 30px;
    height: 30px;
    
    
`;

export default class App extends Component{
    constructor(props){
        super(props);

        this.state = {
            store: new Store(this)
        }
    }

    render(){

        const {store} = this.state;
        return <AppWrapper>

            <Header>

                    <HeaderWrapper>
                        <HeaderTitle>Camera</HeaderTitle>
                        <HeaderUserMenu>
                            <HeaderUserAvatar alt="" src = {userAvatar}></HeaderUserAvatar>
                        </HeaderUserMenu>
                    </HeaderWrapper>

            </Header>
            <Main>
                <Container>
                    <Switch>
                        <Route exact path={'/login'} render={(routeProps)=> <Login {...routeProps} store={store}/>} />
                        <Route exact path={'/register'} render={(routeProps)=> <Register {...routeProps} store={store}/>}/>
                        <Route exact path={'/watch/:id'} render={(routeProps)=> <Watch {...routeProps} store={store}/>}/>
                        <Route exact path={'/'} render={(routeProps)=> <Home {...routeProps} store={store}/>}/>
                    </Switch>
                </Container>

            </Main>
            <Footer>
                <Container>

                    <Copyright>@ 2019 Camera Inc</Copyright>

                </Container>
            </Footer>
        </AppWrapper>
    }
}