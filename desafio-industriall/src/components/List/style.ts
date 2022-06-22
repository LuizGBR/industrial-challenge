import styled from 'styled-components';

import {Card as RBCard, ListGroupItem as RBListGroupItem} from 'reactstrap'

export const Card = styled(RBCard)`
    min-width:800px;
    padding: 24px;
    margin-bottom:24px ;
    background: #FFF;
    box-shadow: 0px 4px 15px 1px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    
    font-family: 'Calibri', sans-serif;
    font-size: 20px;
    font-weight: 700;
    color: #7B7B7B;
    
    border-bottom: none;

    .minute-container{
        min-height: 100px;
        margin-bottom: 16px;

        h1{
            font-weight: 700;
            font-size: 24px;
            color: #1E2251;
        }

        p{
            font-weight: 400;
            font-size: 18px;
            color: #5C5958;
        }

        li{
            border-bottom: 1px solid #C0C1C6;
        }

        li:last-child{
            border-bottom: 0 !important;
        }
    }

`
export const ListGroupItem = styled(RBListGroupItem)`
    border: none;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center; 
    height: 74px;
    
    h1{
        font-weight: 700 !important;
        font-size: 16px !important;
        color: #312F2F !important;
    }

    p{
        font-weight: 400 !important;
        font-size: 14px !important;
        color: #5C5958 !important;
        margin-bottom: 0 !important;
    }

    .buttons-section{
        button{
            margin-left: 22px;
            background: none;
            border: 0;
            
            &:hover{
                    svg path{
                        fill: #1ad8f3;
                    }
                }
        }
    }

`

