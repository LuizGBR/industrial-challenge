import styled from 'styled-components';

export const MyMainPage = styled.div`
    header{
        padding: 18px;
        background: #fff;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);        
    
        .content{
            margin: 0 auto;
            display: flex;
            justify-content: center;
            align-items: center;
    
            > img{
                max-height: 20px;
                cursor: pointer;
            }
        }
    }

    main{
        max-width: 800px;
        margin: 0 auto;
        
        .main-header{
            
            > div{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
                padding: 24px;

                h1{
                    font-weight: 700;
                    font-size: 24px;
                    color: #1E2251;
                    padding-bottom: 8px;
                }
        
                p{
                    font-weight: 400;
                    font-size: 20px;
                    color: #5C5958;
                }
                
                button {
                    border: 0;
                    border-radius: 5px;
                    background: #1ad8f3;
                    color: #1E2251;
        
                    display: flex;
                    justify-content: center;
                    align-self: center;
                    align-items: center;
                    padding: 5px 13px 4px;
                    gap: 10px;
    
                    width: 118px;
                    height: 33px;
                    
                    font-weight: 700;
                    font-size: 14px;
                }
            }
        }

        .content{
            display:flex;
            justify-content: center;
            align-items: center;
        }
    }
`