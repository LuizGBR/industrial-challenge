import './style.scss'
import logoImg from '../../assets/images/logo-escura.svg'
import AddIcon from '@mui/icons-material/Add';

export function MainPage(){
    return(
        <div id="main-page">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Logo"></img>
                </div>
            </header>
           <main>
                <div className="main-header">
                    <div>
                        <div>
                            <h1>Atas de Reunião</h1>
                            <p>Estas são as atas das últimas reuniões.</p>
                        </div> 
                        <button type="button">
                            <AddIcon fontSize="small" />
                            NOVA ATA
                        </button>  
                    </div>
                    
                </div>
           </main>
        </div>
    )
}