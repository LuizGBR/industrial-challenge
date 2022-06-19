import styled from 'styled-components';

export const MyLabel = styled.label`
    font-size: 16px;
    font-weight: 400;
`

export const MySelect = styled.select`
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
    

    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 20px center;
    background-size: 1em;
    &:hover{
        border: 1px solid #4ec1f5; 
    }

    &:focus{   
        border: 0;       
        outline: 1px solid #4ec1f5; 
    }
`
