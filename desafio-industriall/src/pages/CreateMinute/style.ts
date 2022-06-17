import styled from 'styled-components';

import {Card as RBCard, Input as RBInput, CardHeader as RBCardBody, Label as RBLabel , FormGroup as RBFormGroup} from 'reactstrap'




export const Card = styled(RBCard)`
        min-width:800px;
        height: 700px;
        padding: 24px;

        background: #F5F5F5;
        box-shadow: 0px 4px 15px 1px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
            
`

export const CardBody = styled(RBCardBody)`
        font-family: 'Calibri', sans-serif;
        font-size: 20px;
        font-weight: 700;
        color: #7B7B7B;

        background: #F5F5F5;
        border-bottom: none;
    
        .date-inputs{
            display: flex;
            flex-direction: row;
            gap: 24px;

            input{
                max-width: 364px;
            }
        }

        .meeting-content{
            font-family: 'Calibri', sans-serif;
            font-style: italic;
            font-weight: 400;
            font-size: 16px;
            color: #7B7B7B;

            width: 752px;
            height: 100px;

            display: flex;
            justify-content: center;
            align-items: center;
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
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;

    height: 40px;
    width: 752px;
    border-radius: 8px;
    padding: 0 16px;
    background-color:#FFF;
    border: 1px solid #c4c5c9;
    margin-bottom: 18px;
    box-shadow: none !important;

    &:hover{
        border: 1px solid #4ec1f5; 
    }

    &:focus{   
        border: 0;       
        outline: 1px solid #4ec1f5; 
    }

`