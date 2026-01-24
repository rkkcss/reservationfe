import { Divider } from 'antd'
import logo from '../assets/logo.png'
import { Link } from 'react-router'

const Footer = () => {
    return (
        <footer className="border-t border-t-gray-200 p-4 pt-16 bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                    <img src={logo} className="h-14" alt="" />
                    <p className="text-sm pr-5 text-slate-500">
                        Komplex üzleti megoldás szolgáltatóknak. Egyszerűsítsd a vállalkozásod irányítását velünk.
                    </p>
                </div>
                <div className="flex flex-col">
                    <p className="text-sm font-bold uppercase tracking-wider mb-3">Termék</p>
                    <Link to={"#"} className="text-sm text-slate-500 mb-0.5">Funkciók listája</Link>
                    <Link to={"#"} className="text-sm text-slate-500 mb-0.5">Csomagok és árak</Link>
                    <Link to={"#"} className="text-sm text-slate-500 mb-0.5">Mobil alkalmazás</Link>
                    <Link to={"#"} className="text-sm text-slate-500">Integrációk</Link>
                </div>

                <div className="flex flex-col">
                    <p className="text-sm font-bold uppercase tracking-wider mb-3">Partnereknek</p>
                    <Link to={"#"} className="text-sm text-slate-500 mb-0.5">Partner regisztráció</Link>
                    <Link to={"#"} className="text-sm text-slate-500 mb-0.5">Bejelentkezés</Link>
                    <Link to={"#"} className="text-sm text-slate-500 mb-0.5">Esettanulmányok</Link>
                    <Link to={"#"} className="text-sm text-slate-500">Tudásbázis</Link>
                </div>

                <div className="flex flex-col">
                    <p className="text-sm font-bold uppercase tracking-wider mb-3">Támogatás</p>
                    <Link to={"#"} className="text-sm text-slate-500 mb-0.5">Kapcsolat</Link>
                    <Link to={"#"} className="text-sm text-slate-500 mb-0.5">GYIK szolgáltatóknak</Link>
                    <Link to={"#"} className="text-sm text-slate-500 mb-0.5">Adatfeldolgozás</Link>
                    <Link to={"#"} className="text-sm text-slate-500">ÁSZF partnereknek</Link>
                </div>
            </div>
            <Divider />
            <div className="flex">
                <p className="text-center text-gray-500">&copy; {new Date().getFullYear()} Minden jog fenntartva.</p>
                <Link to={"#"} className="ml-auto mr-0">Adatkezelési tájékoztató</Link>
                <Link to={"#"} className="ml-6">Süti beállítások</Link>
            </div>
        </footer>
    )
}

export default Footer