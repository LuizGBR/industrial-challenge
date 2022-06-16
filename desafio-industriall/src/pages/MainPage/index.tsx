import './style.scss'
import logoImg from '../../assets/images/logo-escura.svg'

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
                    <h1>Atas de Reunião</h1>
                    <p>Estas são as atas das últimas reuniões.</p>
                    <button>NOVA ATA</button>
                </div>
           </main>
        </div>
    )
}