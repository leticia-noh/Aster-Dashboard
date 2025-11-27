import { useEffect, useState} from "react"
import { useNavigate } from "react-router-dom"
import Glass from "../components/Glass"
import { useOutletContext } from "react-router-dom";


export default function Login() {
    const { setCurrentUser } = useOutletContext();
    const [profiles, setProfiles] = useState([]);
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch('/mocks/profiles.json')
            .then(response => response.json())
            .then(data => setProfiles(data))
    }, []);

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[url('/src/assets/backgrounds/login.jpg')] bg-cover bg-center gap-6 pb-38">
            <img src="/src/assets/logos/logo-white.svg" alt="Aster Logo" className="h-32" />
            <Glass padding="py-16 px-24">
                <div className="flex flex-row gap-24">
                    {profiles.map((profile: any) => (
                        <div key={profile.nome} className="flex flex-col items-center gap-2">
                            <button className="cursor-pointer" onClick={() => {
                                    console.log("Login: " + `${profile.nome}`);
                                    setCurrentUser(profile.user);
                                    navigate('/home');
                                }}>
                                <img src={profile.avatar} alt={`${profile.nome} Avatar`} className="w-48 h-48 rounded-[1rem] shadow-lg hover:outline-3 outline-[var(--content-inverse)] transition" />
                            </button>
                            
                            <div className="gap-0.5 text-center text-[var(--content-inverse)] text-shadow-md"> 
                                <h4>{profile.nome}</h4>
                                <p className="font-normal">{profile.setor}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Glass>
            
        </div>
    )
}
