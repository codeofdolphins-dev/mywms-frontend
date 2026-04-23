import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';


// import { IRootState } from '../../store';
// import { toggleRTL, toggleTheme, toggleSidebar } from '../../store/themeConfigSlice';
import Dropdown from '../Dropdown';
import IconXCircle from '../Icon/IconXCircle';
import IconInfoCircle from '../Icon/IconInfoCircle';
import IconBellBing from '../Icon/IconBellBing';
import IconUser from '../Icon/IconUser';
import IconMail from '../Icon/IconMail';
import IconLockDots from '../Icon/IconLockDots';
import IconLogout from '../Icon/IconLogout';
import { storeLogout } from '../../store/AuthSlice';
import authService from '../../Backend/Auth.backend';
import FullScreenLoader from '../loader/FullScreenLoader';
import { clearLocation } from '../../store/LocationSlice';
import secureLocalStorage from 'react-secure-storage';
import { useQueryClient } from '@tanstack/react-query';
import AddModal from '../Add.modal';
import ProfileForm from '../user/Profile.form';


const Header = () => {
    const auth = useSelector(state => state.auth);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userData = auth.userData;
    const nodeDetails = userData?.activeNode?.nodeDetails;
    const isLogin = auth.status;


    const [isProfileShow, setIsProfileShow] = useState(false);

    function createMarkup(messages) {
        return { __html: messages };
    }

    /** Open profile details modal automatically after 1.5 seconds if nodeDetails is null */
    useEffect(() => {
        if (nodeDetails === null) {
            const timeRef = setTimeout(() => {
                setIsProfileShow(true);
            }, 1500);
            return () => clearTimeout(timeRef);
        }
    }, [nodeDetails]);


    const [notifications, setNotifications] = useState([
        {
            id: 1,
            profile: 'user-profile.jpeg',
            message: '<strong className="text-sm mr-1">John Doe</strong>invite you to <strong>Prototyping</strong>',
            time: '45 min ago',
        },
        {
            id: 2,
            profile: 'profile-34.jpeg',
            message: '<strong className="text-sm mr-1">Adam Nolan</strong>mentioned you to <strong>UX Basics</strong>',
            time: '9h Ago',
        },
        {
            id: 3,
            profile: 'profile-16.jpeg',
            message: '<strong className="text-sm mr-1">Anna Morgan</strong>Upload a file',
            time: '9h Ago',
        },
    ]);

    const removeNotification = (value) => {
        setNotifications(notifications.filter((user) => user.id !== value));
    };

    const { mutateAsync: logout, isLoading } = authService.TQLogout();
    const queryClient = useQueryClient()


    const handelLogout = async () => {
        try {
            const res = await logout();
            if (res.success) {
                queryClient.clear();

                secureLocalStorage.removeItem("token");
                secureLocalStorage.clear();
                dispatch(storeLogout());
                dispatch(clearLocation());
                navigate("/", { replace: true });
            }
        } catch (error) {
            console.log(error);
            secureLocalStorage.clear();
            dispatch(storeLogout());
            navigate("/auth/login", { replace: true });
        }
    }

    if (isLoading) return <FullScreenLoader />;

    return (
        <header className="relative horizontal" style={{ zIndex: 60 }}>
            <div className="shadow-sm">

                <div className="relative bg-white flex w-full items-center px-5 py-2.5">
                    <div className="horizontal-logo flex lg:hidden justify-between items-center mr-2">
                        <Link to="/" className="main-logo flex items-center shrink-0">
                            <img className="w-8 -ml-1 inline" src="/logo192.png" alt="logo" />
                            <span className="text-2xl ml-1.5 font-semibold  align-middle hidden md:inline transition-all duration-300">MYWMS</span>
                        </Link>
                    </div>

                    <div className="">
                        {nodeDetails?.name ?
                            <span className="text-lg ml-1.5 font-semibold  align-middle hidden md:inline transition-all duration-300">
                                {`${nodeDetails?.name} ${userData?.email}`}
                            </span>
                            :
                            <span className="text-lg ml-1.5 font-semibold  align-middle hidden md:inline transition-all duration-300">{userData?.company_name}</span>
                        }
                    </div>

                    {isLogin ? <>
                        <div className="sm:flex-1 sm:ml-0 ml-auto flex items-center space-x-1.5 lg:space-x-2">
                            <div className="sm:mr-auto sm:ml-auto"></div>

                            {/* notification badge */}
                            <div className="dropdown shrink-0">
                                <Dropdown
                                    offset={[0, 8]}
                                    placement="bottom-end"
                                    btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                    button={
                                        <span>
                                            <IconBellBing />
                                            <span className="flex absolute w-3 h-3 ltr:right-0 rtl:left-0 top-0">
                                                <span className="animate-ping absolute ltr:-left-[3px] rtl:-right-[3px] -top-[3px] inline-flex h-full w-full rounded-full bg-success/50 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full w-[6px] h-[6px] bg-success"></span>
                                            </span>
                                        </span>
                                    }
                                >
                                    <ul className="!py-0 text-dark dark:text-white-dark w-[300px] sm:w-[350px] divide-y dark:divide-white/10">
                                        <li onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center px-4 py-2 justify-between font-semibold">
                                                <h4 className="text-lg">Notification</h4>
                                                {notifications.length ? <span className="badge bg-primary/80">{notifications.length}New</span> : ''}
                                            </div>
                                        </li>
                                        {notifications.length > 0 ? (
                                            <>
                                                {notifications.map((notification) => {
                                                    return (
                                                        <li key={notification.id} className="dark:text-white-light/90" onClick={(e) => e.stopPropagation()}>
                                                            <div className="group flex items-center px-4 py-2">
                                                                <div className="grid place-content-center rounded">
                                                                    <div className="w-12 h-12 relative">
                                                                        <img className="w-12 h-12 rounded-full object-cover" alt="profile" src={`/assets/images/${notification.profile}`} />
                                                                        <span className="bg-success w-2 h-2 rounded-full block absolute right-[6px] bottom-0"></span>
                                                                    </div>
                                                                </div>
                                                                <div className="ltr:pl-3 rtl:pr-3 flex flex-auto">
                                                                    <div className="ltr:pr-3 rtl:pl-3">
                                                                        <h6
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: notification.message,
                                                                            }}
                                                                        ></h6>
                                                                        <span className="text-xs block font-normal dark:text-gray-500">{notification.time}</span>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        className="ltr:ml-auto rtl:mr-auto text-neutral-300 hover:text-danger opacity-0 group-hover:opacity-100"
                                                                        onClick={() => removeNotification(notification.id)}
                                                                    >
                                                                        <IconXCircle />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    );
                                                })}
                                                <li>
                                                    <div className="p-4">
                                                        <button className="btn btn-primary block w-full btn-small">Read All Notifications</button>
                                                    </div>
                                                </li>
                                            </>
                                        ) : (
                                            <li onClick={(e) => e.stopPropagation()}>
                                                <button type="button" className="!grid place-content-center hover:!bg-transparent text-lg min-h-[200px]">
                                                    <div className="mx-auto ring-4 ring-primary/30 rounded-full mb-4 text-primary">
                                                        <IconInfoCircle fill={true} className="w-10 h-10" />
                                                    </div>
                                                    No data available.
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </Dropdown>
                            </div>

                            {/* user badge */}
                            <div className="dropdown shrink-0 flex">
                                <Dropdown
                                    offset={[0, 8]}
                                    placement="bottom-end"
                                    btnClassName="relative group block"
                                    button={<img className="w-9 h-9 rounded-full object-cover saturate-50 group-hover:saturate-100" src="/assets/images/user-profile.jpeg" alt="userProfile" />}
                                >
                                    <ul className="text-dark dark:text-white-dark !py-0 w-[230px] font-semibold dark:text-white-light/90">
                                        <li>
                                            <div className="flex items-center px-4 py-4">
                                                <img className="rounded-md w-10 h-10 object-cover" src="/assets/images/user-profile.jpeg" alt="userProfile" />
                                                <div className="ltr:pl-4 rtl:pr-4 truncate">
                                                    <h4 className="text-base">
                                                        {userData?.name?.full_name}
                                                        {/* <span className="text-xs bg-success-light rounded text-success px-1 ltr:ml-2 rtl:ml-2">Pro</span> */}
                                                    </h4>
                                                    <button type="button" className="text-black/60 hover:text-primary dark:text-dark-light/60 dark:hover:text-white">
                                                        {userData?.email}
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                        <li className='hover:bg-blue-50 hover:text-blue-700'>
                                            <div
                                                className="flex ml-4 gap-2 hover:cursor-pointer py-2"
                                                onClick={() => setIsProfileShow(true)}
                                            >
                                                <IconUser className="w-4.5 h-4.5 shrink-0" />
                                                Profile
                                            </div>
                                        </li>
                                        <li>
                                            <Link to="/apps/mailbox" className="dark:hover:text-white">
                                                <IconMail className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                Inbox
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/auth/boxed-lockscreen" className="dark:hover:text-white">
                                                <IconLockDots className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0" />
                                                Lock Screen
                                            </Link>
                                        </li>
                                        <li
                                            className="border-t border-white-light dark:border-white-light/10 cursor-pointer"
                                            onClick={handelLogout}
                                        >
                                            <div className="text-danger flex items-center py-3 ml-3" >
                                                <IconLogout className="w-4.5 h-4.5 mr-2 rotate-90 shrink-0" />
                                                Log Out
                                            </div>
                                        </li>
                                    </ul>
                                </Dropdown>
                            </div>
                        </div>
                    </> : <>
                        <div
                            className="sm:flex-1 sm:ml-0 ml-auto flex items-center space-x-1.5 lg:space-x-2"
                            onClick={() => navigate("/auth/login", { replace: true })}
                        >
                            <div className="sm:mr-auto sm:ml-auto"></div>
                            <button
                                type="button"
                                className="btn btn-outline-primary rounded-full p-2 animate-pulse bg-[#fafafa] dark:bg-[#060818] dark:hover:bg-primary"
                            >
                                Login
                            </button>
                        </div>
                    </>}
                </div>

                <AddModal
                    isShow={isProfileShow}
                    setIsShow={setIsProfileShow}
                    title="Update Profile Details"
                >
                    <ProfileForm
                        isLoading={false}
                        setIsProfileShow={setIsProfileShow}
                    />

                </AddModal>

            </div>
        </header>
    );
};

export default Header;
