import logoImg from '../../assets/images/logo-escura.svg'
import AddIcon from '@mui/icons-material/Add';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyMainPage } from './style';

type MainPageProps = {
    children?: ReactNode;
    isHomePage?: boolean;
}

export function MainPage({children, isHomePage} : MainPageProps ){
    const navigate = useNavigate()

    const title = isHomePage ? 'Atas de Reunião' : 'Nova ata de Reunião'
    const subtitle = isHomePage ? 'Estas são as atas das últimas reuniões.' : 'Os campos obrigatórios estão marcados com um asterisco (*)'

    return(
        <MyMainPage>
            <header>
                <div className="content">
                    <img src={logoImg} alt="Logo"></img>
                </div>
            </header>
           <main>
                <div className="main-header">
                    <div>
                        <div>
                            <h1>{title}</h1>
                            <p>{subtitle}</p>
                        </div>
                        {isHomePage && (
                            <button type="button" onClick={() => navigate('/minute')}>
                                <AddIcon fontSize="small" />
                            NOVA ATA
                        </button>  
                        )}
                        
                    </div>
                </div>
                <div className="content">
                    {children}
                </div>    
           </main>
        </MyMainPage>
    )
}