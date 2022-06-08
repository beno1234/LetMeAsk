import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';
import logoImg from '../assets/images/logo.svg';
import { Button } from '../components/Button';
import { Question } from '../components/Question';
import RoomCode from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';


import '../styles/room.scss';





type RoomParams = {
    id: string;
}

export function AdminRoom() {
    //const { user } = useAuth();
    const history = useNavigate();
    const params = useParams<RoomParams>();

    const roomId = params.id;
    const { title, questions } = useRoom(roomId);



    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }


    async function handleCheckQuestionAsAnswer(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        })
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true,
        })

    }


    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endedAt: new Date(),
        })

        history('/');

    }




    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="LetmeAsk" />
                    <div>
                        {params.id && <RoomCode code={params.id} />}
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>

                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >


                                {!question.isAnswered && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleCheckQuestionAsAnswer(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta como respondida" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleHighlightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Destacar pergunta" />
                                        </button>
                                    </>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deleteImg} alt="remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    );
}