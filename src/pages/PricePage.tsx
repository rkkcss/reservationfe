import { Button, Divider } from "antd"
import { BiCheck } from "react-icons/bi"

const PricePage = () => {
    return (
        <div className="px-4 mt-6">
            <h1 className="text-3xl font-bold mb-6">Simple pricing based on your needs!</h1>
            <p className="mb-5 text-base">Discover a variety of our advanced features. Unlimited and free for individuals.</p>
            <div className="flex gap-6">
                <div className="p-8 border rounded-lg shadow-md">
                    <p className="text-xl mb-4 font-bold">Kezdő csomag</p>
                    <p>Indulás</p>
                    <p className="flex items-center">
                        <span className="text-3xl mr-2 my-2"> 0 Ft</span>
                        / hónap / felhasználó
                    </p>
                    <p>Megfelelő kezdés annak, aki most kezdte és csak szimplán a legszükségesebbre van szüksége.</p>
                    <div className="flex justify-center mt-4">
                        <Button type="default">Vágjunk bele</Button>
                    </div>
                    <Divider />
                    <p className="text-base font-semibold">Örökké ingyenes</p>

                    <ul>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            Max 100 foglalás
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            1 szolgáltatás
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            Korlátlan naptár használat
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            Saját foglalási oldal
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            E-mail emlékeztetők
                        </li>
                    </ul>
                </div>

                <div className="p-8 border border-primary rounded-lg shadow-md bg-primary/5 relative">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white px-3 py-1 rounded-bl-lg font-semibold">Népszerű</div>
                    <p className="text-xl mb-4 font-bold">Haladó csomag</p>
                    <p>Indulás</p>
                    <p className="flex items-center">
                        <span className="text-3xl mr-2 my-2"> 2990 Ft</span>
                        / hónap / felhasználó
                    </p>
                    <p>Megfelelő kezdés annak, aki most kezdte és csak szimplán a legszükségesebbre van szüksége.</p>
                    <div className="flex justify-center mt-4">
                        <Button type="primary">Vágjunk bele</Button>
                    </div>
                    <Divider />
                    <p className="text-base font-semibold">Örökké ingyenes</p>

                    <ul>
                        <li className="flex items-center gap-1 font-semibold">
                            <BiCheck size={25} className="text-green-700" />
                            Kezdő csomag minden funkciója
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            500 max foglalás
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            5 szolgáltatás
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            Korlátlan naptár használat
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            Saját foglalási oldal
                        </li>
                    </ul>
                </div>

                <div className="p-8 border rounded-lg shadow-md">
                    <p className="text-xl mb-4">Profi csomag</p>
                    <p>Indulás</p>
                    <p className="flex items-center leading-9">
                        <span className="text-3xl mr-2 my-2"> 5990 Ft</span>
                        / hónap / felhasználó
                    </p>
                    <p>Megfelelő kezdés annak, aki most kezdte és csak szimplán a legszükségesebbre van szüksége.</p>

                    <div className="flex justify-center mt-4">
                        <Button type="default">Vágjunk bele</Button>
                    </div>
                    <Divider />
                    <p className="text-base font-semibold">Örökké ingyenes</p>

                    <ul>
                        <li className="flex items-center gap-1 font-semibold">
                            <BiCheck size={25} className="text-green-700" />
                            Haladó csomag minden funkciója
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            Korlátlan foglalás
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            Korlátlan szolgáltatás
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            Testreszabható foglalási oldal
                        </li>
                        <li className="flex items-center gap-1">
                            <BiCheck size={25} className="text-green-700" />
                            Saját foglalási oldal
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default PricePage