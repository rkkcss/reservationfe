import { Button } from "antd"
import { FiTarget } from "react-icons/fi"
import { MdOutlineHistoryEdu, MdVerifiedUser } from "react-icons/md"

const AboutPage = () => {
    return (
        <main className="flex-1 relative">
            <div className="absolute inset-0 geo-pattern pointer-events-none"></div>
            <div className="layout-container flex h-full grow flex-col relative z-10">
                <div className="flex flex-1 justify-center py-12 md:py-24">
                    <div className="layout-content-container flex flex-col max-w-[1000px] flex-1 px-6">
                        <div className="mb-16 md:mb-24 text-center">
                            <h1 className="text-[#0d181b] tracking-tight text-4xl md:text-6xl font-extrabold leading-[1.1] mb-6">
                                Szenvedélyünk a szépség <br className="hidden md:block" /> és a <span className="text-primary">pontosság</span>.
                            </h1>
                            <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
                                Modern technológiát és elegáns megoldásokat kínálunk a szépségipari szakemberek digitális jelenlétéhez.
                            </p>
                            <div className="w-20 h-1 bg-primary/20 mx-auto mt-12 rounded-full"></div>
                        </div>
                        <div className="flex justify-center mb-8">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary bg-primary/10 px-4 py-1.5 rounded-full">Alapértékeink</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4">
                            <div className="group flex flex-1 gap-6 rounded-2xl border border-slate-200  bg-white  p-8 flex-col hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                                <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-[28px]">
                                        <FiTarget />
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <h2 className="text-[#0d181b]  text-xl font-bold leading-tight">Küldetésünk</h2>
                                    <p className="text-slate-600  text-sm leading-relaxed">
                                        Célunk, hogy modern technológiával segítsük a szépségipari szakemberek mindennapi munkáját és növekedését, levéve a vállukról az adminisztráció terhét.
                                    </p>
                                </div>
                            </div>
                            <div className="group flex flex-1 gap-6 rounded-2xl border border-slate-200 bg-white  p-8 flex-col hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                                <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-[28px]">
                                        <MdVerifiedUser />
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <h2 className="text-[#0d181b] text-xl font-bold leading-tight">Értékeink</h2>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Átláthatóság, megbízhatóság és felhasználóközpontú szemlélet minden fejlesztésünk mögött. Hisszük, hogy a technológia akkor jó, ha láthatatlan marad.
                                    </p>
                                </div>
                            </div>
                            <div className="group flex flex-1 gap-6 rounded-2xl border border-slate-200  bg-white p-8 flex-col hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
                                <div className="bg-primary/10 text-primary w-12 h-12 flex items-center justify-center rounded-xl group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                                    <span className="material-symbols-outlined text-[28px]">
                                        <MdOutlineHistoryEdu />
                                    </span>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <h2 className="text-[#0d181b] text-xl font-bold leading-tight">Történetünk</h2>
                                    <p className="text-slate-600 text-sm leading-relaxed">
                                        Egy egyszerű naptáralkalmazásként indultunk egy budapesti kis szalonban, mára pedig egy komplex, több ezer szakembert kiszolgáló foglalási rendszerré váltunk.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-24 border-t border-slate-200  pt-20">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-10 px-4">
                                <div className="flex flex-col gap-4 max-w-[500px]">
                                    <h3 className="text-[#0d181b] text-3xl font-bold leading-tight">Szakértelem a digitális térben</h3>
                                    <p className="text-slate-500 text-base font-normal leading-normal">
                                        Modern megoldások a hagyományos szépségápoláshoz. Segítünk, hogy Ön arra koncentrálhasson, amihez a legjobban ért: vendégei megszépítésére.
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <Button type="primary" size="large">
                                        Csatlakozzon hozzánk
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default AboutPage