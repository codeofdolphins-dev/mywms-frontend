import { Suspense, useEffect, useState } from 'react';
import Header from '../components/layout/Header';
import { Outlet } from 'react-router-dom';
import NavBar from '../components/layout/NavBar';
import AuthBootstrap from './AuthBootstrap';


const AppLayout = () => {

    const [showLoader, setShowLoader] = useState(true);
    const [showTopButton, setShowTopButton] = useState(false);

    const goToTop = () => {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    const onScrollHandler = () => {
        if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
            setShowTopButton(true);
        } else {
            setShowTopButton(false);
        }
    };

    /** screen loader */
    useEffect(() => {
        window.addEventListener('scroll', onScrollHandler);

        const screenLoader = document.getElementsByClassName('screen_loader');
        if (screenLoader?.length) {
            screenLoader[0].classList.add('animate__fadeOut');
            setTimeout(() => {
                setShowLoader(false);
            }, 200);
        }

        return () => {
            window.removeEventListener('onscroll', onScrollHandler);
        };
    }, []);

    return (
        <>
            <AuthBootstrap >
                {/* BEGIN MAIN CONTAINER */}
                <div className="relative">
                    <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-50">
                        {showTopButton && (
                            <button type="button" className="btn btn-outline-primary rounded-full p-2 animate-pulse bg-[#fafafa] dark:bg-[#060818] dark:hover:bg-primary" onClick={goToTop}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l4-4m0 0l4 4m-4-4v18" />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className={`navbar-sticky main-container text-black dark:text-white-dark min-h-screen`}>

                        <div className="main-content flex flex-col min-h-screen">
                            <Header />
                            <NavBar />

                            <Suspense>
                                <div className={`p-6 animate__animated`}>
                                    <Outlet />
                                </div>
                            </Suspense>
                        </div>
                    </div>
                </div>
            </AuthBootstrap>
        </>
    );
};

export default AppLayout;
