import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

import { Button } from '../components/Button';
import { database } from '../services/firebase';

import '../styles/auth.scss';
import { useAuth } from '../hooks/useAuth';

export function NewRoom(){

   const { user } = useAuth();

   const [newRoom, setNewRoom] = useState('');

   const history = useNavigate();


   async function handleCreateRoom(event:FormEvent) {
       event.preventDefault();

       if( newRoom.trim() === ''){
        return;
       }

       // salvar informação dentro de uma lista e se nao for uma lista vc deixa de usar o push e usa o set.
       const roomRef = database.ref('rooms');

       const firebaseRoom = await roomRef.push({
           title: newRoom,
           authorId: user?.id,
       }) 
       
       history(`/rooms/${firebaseRoom.key}`)
       
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
                    <h2>Criar uma nova sala</h2>
                    <form onSubmit={handleCreateRoom}>
                        <input 
                        type="text" 
                        placeholder='Nome da Sala'
                        onChange={event => setNewRoom(event.target.value)}
                        value={newRoom}
                        />
                        <Button type='submit'>
                            Criar sala
                        </Button>
                    </form>
                    <p>Quer entrar em uma sala existente? <Link to="/">Clique Aqui</Link></p>
                </div>
            </main>
        </div>
    )
}   