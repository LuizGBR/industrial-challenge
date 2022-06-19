import styled from 'styled-components';

export const MyLabel = styled.label`
    font-size: 16px;
    font-weight: 400;
`

export const MyInput = styled.input`
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
