import { useTranslation } from "react-i18next";
import NavBar from "../components/NavBar";
import { Button } from "antd";
import img1 from "../assets/home1.svg"
import img2 from "../assets/home2.svg"
import signup from "../assets/singup.svg"
import completed from "../assets/completed.svg"
import calendar from "../assets/calendar.svg"
import share from "../assets/share.svg"
import datepicker from "../assets/datepicker.svg"
import { TbCircleNumber1, TbCircleNumber2, TbCircleNumber3 } from "react-icons/tb";

type Props = {}

const Home = (props: Props) => {
    const { t, i18n: { changeLanguage, language } } = useTranslation();
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 items-center px-4">
                <div>
                    <p className="text-3xl font-semibold mb-4">Book with the best, near you</p>
                    <p>Take a scroll around the block to see top health and beauty businesses on Booksy's marketplace.
                        <br />
                        Check out their vibe from their business profile and hear what other people are saying with verified reviews.
                        <br />
                        You can even look through their portfolio of work.
                        Save time and leave the stress to someone else.
                        <br />
                        With Beautiotime, setting up your next beauty appointment is free and easy.
                    </p>
                </div>
                <div>
                    <img src={img1} alt="" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center mt-36 px-4">
                <div className="flex justify-center">
                    <img src={img2} alt="" className="max-h-96" />
                </div>
                <div>
                    <p className="text-3xl font-semibold mb-4">Book with the best, near you</p>
                    <p>Take a scroll around the block to see top health and beauty businesses on Booksy's marketplace.
                        <br />
                        Check out their vibe from their business profile and hear what other people are saying with verified reviews.
                        <br />
                        You can even look through their portfolio of work.
                        Save time and leave the stress to someone else.
                        <br />
                        With Beautiotime, setting up your next beauty appointment is free and easy.
                    </p>
                </div>
            </div>

            <div className="flex flex-col items-center mt-28">
                <p className="text-center text-4xl font-semibold mb-20">Hogyan müködik?</p>
                <div className="max-w-[60rem]">

                    <div className="flex gap-3 justify-start">
                        <TbCircleNumber1 size={40} className="self-center" />
                        <img src={signup} alt="sing-up" className="max-h-28" />
                        <div className="h-full">
                            <p className="text-2xl mb-2">
                                Regisztrálj ingyenesen az időpontfoglaló rendszerre.
                            </p>
                            <p className="text-gray-500">
                                Regisztrálj ingyenesen az időpontfoglaló rendszerre.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-start mt-20">
                        <TbCircleNumber2 size={40} className="self-center" />
                        <img src={calendar} alt="sing-up" className="max-h-28" />
                        <div className="h-full">
                            <p className="text-2xl mb-2">
                                Hozd létre az időpontfoglaló oldalad.
                            </p>
                            <p className="text-gray-500">
                                Regisztrálj ingyenesen az időpontfoglaló rendszerre.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-start mt-20">
                        <TbCircleNumber3 size={40} className="self-center" />
                        <img src={share} alt="sing-up" className="max-h-28" />
                        <div className="h-full">
                            <p className="text-2xl mb-2">
                                Oszd meg az oldalad az ügyfeleiddel.
                            </p>
                            <p className="text-gray-500">
                                Add hozzá a honlapodhoz vagy küldd el az időpontfoglaló oldalad linkjét az ügyfeleidnek, hogy könnyedén tudjanak hozzád időpontot foglalni.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center mt-44">
                <div>
                    <p className="text-3xl font-semibold mb-4">
                        Minden időpont egy helyen.
                    </p>
                    <p>
                        Az időpontfoglaló rendszerhez jár egy saját online naptár, ahol könnyedén áttekintheted és kezelheted az időpontjaidat és minden egyéb elfoglaltságodat.
                    </p>
                </div>
                <div className="flex justify-center">
                    <img src={datepicker} alt="" className="max-h-72" />
                </div>
            </div>
        </>
    )
}

export default Home;