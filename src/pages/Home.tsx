import { useNavigate } from'react-router-dom';
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import GoogleIconImg from '../assets/images/google-icon.svg';
import { Button } from '../components/Button';
import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { database } from '../services/firebase';

export function Home(){

    const history = useNavigate();

    const { user, signInWithGoogle } = useAuth();

    const [roomCode, setRoomCode] = useState('');

    // entrar somente se logar, com o google ou entrar em uma sala
    async function handleCreateRoom(){
        if(!user){
            await signInWithGoogle()
        }



        history('/rooms/new');

        
    }


    async function handleJoinRoom(event:FormEvent) {
            event.preventDefault();

        if(roomCode.trim() === '') {
            return;
        }

        //verificar se a sala realmete existe || inserir o codigo corretamente
        const roomRef = await database.ref(`rooms/${roomCode}`).get();

        if(!roomRef.exists()) {
            alert(`Room does not exist, please verify your code room and try again!`);
            return;
        }
        
        if(roomRef.val().endedAt){
            alert('Room already closed.')
            return;
        }

        history(`/rooms/${roomCode}`)
    }

    return(
        <div id="page-auth">
            <aside>
                <img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
                <strong>Crie salas de Q&amp;A ao-vivo</strong>
                <p>Tire as dúvidas da sua audiência em tempo real</p>
            </aside>
            <main>
                <div className="main-content">
                    <img src={logoImg} alt="LetmeAsk" />
                    <button onClick={handleCreateRoom} className="create-room">
                        <img src={GoogleIconImg} alt="Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">Ou entre em uma sala</div>
                    <form onSubmit={handleJoinRoom}>
                        <input 
                        type="text" 
                        placeholder='Digite o código da sala'
                        onChange={event => setRoomCode(event.target.value)}
                        value={roomCode}
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}   