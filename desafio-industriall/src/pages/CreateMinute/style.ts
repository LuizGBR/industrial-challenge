import styled from 'styled-components';

import {
    Card as RBCard, 
    Input as RBInput, 
    Label as RBLabel , 
    FormGroup as RBFormGroup,
} from 'reactstrap'

import { Form as UnForm } from '@unform/web'



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
`

export const Form = styled(UnForm)`
        h2{
            font-family: 'Calibri', sans-serif;
            font-size: 20px;
            font-weight: 700;
            color: #7B7B7B;

            margin-bottom: 18px;
        }

        .date-time{
            input{
                display: flex ;
                max-width: 364px;
            }
        }

        .date-time-inputs{
            display: flex;
            flex-direction: row;
            gap: 24px;

            input{
                max-width: 364px;
            }
        }

        .meeting-content{
            
            font-style: italic;
            font-weight: 400;
            font-size: 16px;
            color: #7B7B7B;

            width: 752px;
            height: 200px;

            display: flex;
            justify-content: center;
            align-items: center;

            margin-bottom: 18px;
        }

        .form-footer{
            display: flex;
            justify-content: flex-end;
            gap: 16px;

    button{
        font-weight: 700;
        display: flex;
        justify-content: center;
        align-self: center;
        align-items: center;

        width: 125px;
        height: 38px;
        
        border-radius: 5px;
        border: 0;
    }

    .cancel{
        background: #c0c1c6;
        color: #5C5958;
        }

    .save{
        background: #44c08a;
        color: #FFF;
    }
        }
`

export const FormGroup = styled(RBFormGroup)`
    margin-top: 8px;
    margin-bottom: 0 !important;
`

export const Label = styled(RBLabel)`
    font-size: 16px;
    font-weight: 400;
`

export const Input = styled(RBInput)`
    line-height: 20px;

    height: 40px;
    width: 752px;
    border-radius: 8px;
    padding: 0 16px;
    background-color:#FFF;
    border: 1px solid #c4c5c9;
    margin-bottom: 18px;
    box-shadow: none !important;
    margin-top: 8px;

    &:hover{
        border: 1px solid #4ec1f5; 
    }

    &:focus{   
        border: 0;       
        outline: 1px solid #4ec1f5; 
    }

`
