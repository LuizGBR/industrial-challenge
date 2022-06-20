import styled from 'styled-components';

export const MyTextarea = styled.div`
    label{
        font-size: 16px;
        font-weight: 400;
        margin-bottom: 8px;
    }

    textarea{
        line-height: 20px;
        height: 200px;
        width: 752px;
        border-radius: 8px;
        padding: 8px 16px;
        background-color:#FFF;
        border: 1px solid #c4c5c9;
        box-shadow: none !important;

        &:hover{
            border: 1px solid #4ec1f5; 
        }

        &:focus{   
            border: 0;       
            outline: 1px solid #4ec1f5; 
        }
    }

    span{
        font-family: 'Calibri', sans-serif;
        font-weight: 400;
        font-size: 12px;
        color: #dc3545; 
    }
`