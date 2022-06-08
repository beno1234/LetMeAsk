import firebase from "firebase/compat/app";
import { createContext, ReactNode, useEffect, useState } from "react";
import { auth } from "../services/firebase";



// tipagem para pegar dados do usuario
type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
  type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
  }
  
    // tipagem para dar rotas ao botao q é exportado daqui
  type AuthContextProviderProps = {
      children: ReactNode;
  }


export const AuthContext = createContext({} as AuthContextType)


export function AuthContextProvider(props: AuthContextProviderProps){

    const [user, setUser] = useState<User>();
    // vai no firebase e fica procurando e monitorando se ja existia algum tipo de login no site ou app {useEffect}
      useEffect(()=> { 
        const unsubscribe = auth.onAuthStateChanged(user => {
          if (user){
            const { displayName, photoURL, uid } = user
    
            if(!displayName || !photoURL){
              throw new Error('Misssing information from Google Account.');
            }
    
            setUser({
              id: uid,
              name: displayName,
              avatar: photoURL
            })
          }
        })
    
        return () => {
          unsubscribe();
        }
       }, [])
    
       // autenticação com o google
      async function signInWithGoogle(){
        const provider = new firebase.auth.GoogleAuthProvider();
    
        const result = await auth.signInWithPopup(provider)
    
                if(result.user){
                  const { displayName, photoURL, uid } = result.user
    
                  if(!displayName || !photoURL){
                    throw new Error('Misssing information from Google Account.');
                  }
    
                  setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                  })
                }
    
                
            
      }


    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>
    );
}