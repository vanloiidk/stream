import React,{Component} from 'react'
import styled  from 'styled-components'
import {history} from '../../history'

const HomeWrapper = styled.div `
  
`
const WatchBt = styled.div`
        width: 150px;
        height: 30px
        border: 1px solid rgba(0, 0, 0.06);
        padding: 3px 5px;
        background: #FFF;
        font-weight: 600;
        text-align: center;
        margin-left: 10px;
      

`
export default class Home extends Component{

    render(){

        return <HomeWrapper>
            <h1>Welcome to Camera App.</h1>
            <WatchBt onClick={()=>{
                history.push('/watch/loi');
            }}>Go to channel</WatchBt>
        </HomeWrapper>
    }
}