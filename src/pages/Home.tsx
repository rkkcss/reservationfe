
import { Button, Card, Carousel } from "antd";
import { TbPresentationAnalytics } from "react-icons/tb";
import banner1 from "../assets/banner1.jpg"
import banner2 from "../assets/banner2.webp"
import m1 from "../assets/m-1.webp"
import m2 from "../assets/m-2.webp"
import m3 from "../assets/m-3.webp"
import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlineCampaign, MdOutlineGroups } from "react-icons/md";
import { useNavigate } from "react-router";
import { useAppSelector } from "../store/hooks";
import { notificationManager } from "../utils/notificationConfig";

const Home = () => {
    const navigate = useNavigate();
    const { user } = useAppSelector(state => state.userStore);

    const handleNavigateRegister = () => {
        if (user) {
            notificationManager.show("info", "already-logged-in", { message: "Be vagy jelentkezve", description: "Kijelentkezés után tudsz regisztrálni újra." });
            return;
        };
        navigate("/register");
    }
    return (
        <>
            <Carousel effect="fade" autoplay autoplaySpeed={8000} className="h-[50vh] mb-9" >
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={banner1}
                        alt="Banner 1"
                        className="h-[50vh] object-cover object-center w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center z-20 text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6 max-w-3xl drop-shadow-md">
                            Növeld bevételeidet a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 font-extrabold">foglalási rendszerünkkel!</span>
                        </h1>
                        <p className="text-lg max-w-2xl mb-10 text-gray-100">
                            Automatizáld az időpontfoglalást, csökkentsd az adminisztrációt és szerezz több visszatérő vendéget.
                        </p>
                        <div className="flex gap-4">
                            <Button type="primary" size="large" iconPosition="end" icon={<FaArrowRight />} onClick={handleNavigateRegister}>
                                Partner regisztráció
                            </Button>
                        </div>
                        <div className="flex gap-6 mt-5">
                            <div className="flex items-center gap-2">
                                <FaCheckCircle size={18} className="text-green-500" />
                                <p>30 napos ingyenes próba</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheckCircle size={18} className="text-green-500" />
                                <p>Nincs hűségidő</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheckCircle size={18} className="text-green-500" />
                                <p>Azonnali beállítás</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative overflow-hidden rounded-lg">
                    <img
                        src={banner2}
                        alt="Banner 1"
                        className="h-[50vh] object-cover object-center w-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10"></div>
                    <div className="absolute inset-0 p-6 flex flex-col justify-center z-20 text-white">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6 max-w-3xl drop-shadow-md">
                            Növeld bevételeidet a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400 font-extrabold">foglalási rendszerünkkel!</span>
                        </h1>
                        <p className="text-lg max-w-2xl mb-10 text-gray-100">
                            Automatizáld az időpontfoglalást, csökkentsd az adminisztrációt és szerezz több visszatérő vendéget. Professzionális megoldás szépségipari és wellness vállalkozásoknak.
                        </p>
                        <div className="flex gap-4">
                            <Button type="primary" size="large" iconPosition="end" icon={<FaArrowRight />} onClick={handleNavigateRegister}>
                                Partner regisztráció
                            </Button>
                        </div>
                        <div className="flex gap-6 mt-5">
                            <div className="flex items-center gap-2">
                                <FaCheckCircle size={18} className="text-green-500" />
                                <p>30 napos ingyenes próba</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheckCircle size={18} className="text-green-500" />
                                <p>Nincs hűségidő</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <FaCheckCircle size={18} className="text-green-500" />
                                <p>Azonnali beállítás</p>
                            </div>
                        </div>
                    </div>
                </div>
            </Carousel>

            <div className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-white rounded-3xl my-8 shadow-sm border border-gray-100 mx-auto">

                <div className="flex items-center justify-between mb-12">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Kinek ajánljuk?</h2>
                        <p className="text-slate-600 dark:text-text-secondary">Rendszerünk rugalmasan alkalmazkodik minden szolgáltatói igényhez.</p>
                    </div>
                    {/* <Link to={"#"} className="flex items-center gap-2">
                        További iparágak <span>
                            <FaArrowRight size={16} />
                        </span>
                    </Link> */}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <Card className="shdow-lg bg-gray-50 border border-gray-100" bordered={false}
                        cover={
                            <div className="relative">
                                <img src={m1} alt="Relaxing spa massage environment with stones" className="h-48 w-full object-cover object-bottom" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">Fodrászok és Borbélyok</h3>
                                </div>
                            </div>
                        }
                    >

                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-slate-600 dark:text-text-secondary text-sm">
                                <span className="material-symbols-outlined text-primary shrink-0 text-[20px]"><FaCheckCircle size={18} /></span>
                                Gyors, 1 perces foglalások
                            </li>
                            <li className="flex items-start gap-3 text-slate-600 dark:text-text-secondary text-sm">
                                <span className="material-symbols-outlined text-primary shrink-0 text-[20px]"><FaCheckCircle size={18} /></span>
                                Ismétlődő vendégek kezelése
                            </li>
                            <li className="flex items-start gap-3 text-slate-600 dark:text-text-secondary text-sm">
                                <span className="material-symbols-outlined text-primary shrink-0 text-[20px]"><FaCheckCircle size={18} /></span>
                                Beosztás kezelés több székre
                            </li>
                        </ul>
                        <Button className="w-full mt-6">
                            Részletek fodrászoknak
                        </Button>
                    </Card>
                    <Card className="shadow-lg bg-gray-50 border border-gray-100" bordered={false}
                        cover={
                            <div className="relative">
                                <img src={m2} alt="Relaxing spa massage environment with stones" className="h-48 w-full object-cover object-bottom" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">Műkörmösök és Kozmetikusok</h3>
                                </div>
                            </div>

                        }
                    >
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-slate-600 dark:text-text-secondary text-sm">
                                <span className="material-symbols-outlined text-primary shrink-0 text-[20px]"><FaCheckCircle size={18} /></span>
                                Galéria a munkáid bemutatására
                            </li>
                            <li className="flex items-start gap-3 text-slate-600 dark:text-text-secondary text-sm">
                                <span className="material-symbols-outlined text-primary shrink-0 text-[20px]"><FaCheckCircle size={18} /></span>
                                Előlegfizetés kezelése
                            </li>
                            <li className="flex items-start gap-3 text-slate-600 dark:text-text-secondary text-sm">
                                <span className="material-symbols-outlined text-primary shrink-0 text-[20px]"><FaCheckCircle size={18} /></span>
                                SMS emlékeztetők a "no-show" ellen
                            </li>
                        </ul>
                        <Button className="w-full mt-6">
                            Részletek kozmetikusoknak
                        </Button>
                    </Card>
                    <Card
                        className="shadow-lg bg-gray-50 border border-gray-100"
                        bordered={false}
                        cover={
                            <div className="relative">
                                <img src={m3} alt="Relaxing spa massage environment with stones" className="h-48 w-full object-cover object-bottom" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="text-xl font-bold">Masszőrök és Terapeuták</h3>
                                </div>
                            </div>
                        }
                    >
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3 text-slate-600 dark:text-text-secondary text-sm">
                                <span className="material-symbols-outlined text-primary shrink-0 text-[20px]"><FaCheckCircle size={18} /></span>
                                Szünetek automatikus beiktatása
                            </li>
                            <li className="flex items-start gap-3 text-slate-600 dark:text-text-secondary text-sm">
                                <span className="material-symbols-outlined text-primary shrink-0 text-[20px]"><FaCheckCircle size={18} /></span>
                                Digitális kórtörténet és jegyzetek
                            </li>
                            <li className="flex items-start gap-3 text-slate-600 dark:text-text-secondary text-sm">
                                <span className="material-symbols-outlined text-primary shrink-0 text-[20px]"><FaCheckCircle size={18} /></span>
                                Bérletek és ajándékutalványok
                            </li>
                        </ul>
                        <Button className="w-full mt-6">
                            Részletek masszőröknek
                        </Button>
                    </Card>

                </div >
            </div>

            <section className="w-full px-4 sm:px-6 lg:px-8 py-20 bg-white rounded-3xl my-8 shadow-sm border border-gray-100 mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">Minden eszköz a növekedéshez</h2>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Rendszerünket úgy terveztük, hogy levegye a válladról a szervezés terhét, így te a szakmádra koncentrálhatsz.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg group">
                        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined !text-[32px]">
                                <IoCalendarOutline />
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Naptár kezelés</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Átlátható digitális naptár, amely szinkronizálható a Google Naptárral. Kezeld a beosztásokat és szüneteket egyszerűen.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg group">
                        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center text-green-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined !text-[32px]">
                                <TbPresentationAnalytics />
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Részletes statisztikák</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Kövesd nyomon bevételeidet, a legnépszerűbb szolgáltatásokat és a vendégek visszatérési arányát valós idejű adatokkal.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg group">
                        <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined !text-[32px]">
                                <MdOutlineGroups />
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Ügyfélkezelés (CRM)</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Építs saját ügyféladatbázist. Jegyzetelj preferenciákat, előzményeket és küldj automatikus emlékeztetőket.
                        </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-lg group">
                        <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                            <span className="material-symbols-outlined !text-[32px]">
                                <MdOutlineCampaign />
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Online marketing</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Jelenj meg kiemelten a keresőben, gyűjts valós értékeléseket és indíts hírlevél kampányokat vendégeidnek.
                        </p>
                    </div>
                </div>
            </section>

            <div className="mx-auto bg-gradient-to-r bg-primary rounded-2xl overflow-hidden shadow-2xl relative w-full">
                <div className="relative z-10 px-6 py-12 md:px-12 md:py-20 text-center flex flex-col items-center justify-center gap-6">
                    <h2 className="text-3xl md:text-5xl font-black text-white mb-2">Készen állsz a növekedésre?</h2>
                    <p className="text-blue-100 text-lg md:text-xl max-w-2xl text-center leading-relaxed">
                        Csatlakozz te is a több ezer elégedett szolgáltatóhoz, és próbáld ki a FoglaljMost rendszerét 30 napig teljesen ingyen!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
                        <button className="px-8 py-4 bg-white text-primary font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-colors text-lg w-full sm:w-auto">
                            Ingyenes regisztráció
                        </button>
                        <button className="px-8 py-4 bg-blue-700/50 text-white border border-white/20 font-bold rounded-xl hover:bg-blue-700 transition-colors text-lg w-full sm:w-auto">
                            Kapcsolatfelvétel
                        </button>
                    </div>
                    <p className="text-blue-200 text-sm mt-2 opacity-80">Bankkártya nem szükséges a regisztrációhoz.</p>
                </div>
            </div>
        </>
    )
}

export default Home;