// components/NavBar/NavBar.tsx

import LanguageSelector from './LanguageSelector';
import GlobalSearch from '../GlobalSearch/GlobalSearch';
import { Header } from 'antd/es/layout/layout';

const NavBar = () => {
    return (
        <>
            <Header className="bg-white mb-4 sticky top-0 z-20 px-1 sm:px-4 md:px-6 border-b border-slate-200">
                <ul className="flex gap-2 items-center h-full">

                    {/* TODO: implement logic for logo */}
                    {/* <img src={logo} className="h-12 min-h-12 cursor-pointer" alt="logo" onClick={() => navigate('/')} /> */}

                    <GlobalSearch />

                    <li className="md:block hidden p-[5px] hover:text-primary hover:bg-slate-200 transition rounded-full ml-auto mr-0">
                        <LanguageSelector />
                    </li>
                </ul>
            </Header >
        </>
    );
};

export default NavBar;
