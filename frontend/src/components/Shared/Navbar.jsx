import { useState,useRef,useEffect } from "react";
import { useDispatch,useSelector } from "react-redux";
import { Link,useLocation,useNavigate } from "react-router-dom";
import AuthenticationPopUp from "../popUp/authentication/AuthenticationPopUp";
import MiniNavbar from "./DashboardMenu";
import { getUser,userLogOut } from "../../redux/actions/userActions";
import hamburgerMenu from "../../assets/basicIcon/hamburgerMenu.svg";
import motelLogo from "../../assets/Travel_Logo.png";
import userProfile from "../../assets/basicIcon/user-profile.png";
import searchIcon from "../../assets/basicIcon/search.svg";
import house from "../../assets/basicIcon/houseWhite.png";
// import SelectCities from "../Home/SelectCities";

const Navbar=() => {
  const user=useSelector((state) => state.user.userDetails);
  const [showUserMenu,setShowUserMenu]=useState(false);
  const navigate=useNavigate();
  const userMenuRef=useRef(null);
  const location=useLocation();
  const pathName=location.pathname;
  const inUserProfile=pathName?.includes("/users/show/");
  const inUserDashboard=pathName?.includes("/users/dashboard/");
  const inHostHomesLandingPage=pathName?.includes("/host/homes");
  const inListingDetailsPage=pathName?.includes("/listing");
  const inBookingPage=pathName?.includes("/book/stays");
  const isSmallDevice=window.innerWidth<768;

  const [popup,setPopup]=useState(false);

  const dispatch=useDispatch();
  const [searchQuery,setSearchQuery]=useState('');

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };

  const query = useQuery();

  useEffect(() => {
    if (query.get('signup') === 'true') {
      setShowUserMenu(false);
      setPopup(true);
    }
  }, [query]);

  const handleLogout=() => {
    dispatch(userLogOut());
  };

  useEffect(() => {
    dispatch(getUser());
  },[]);
  const handleSearch=() => {
    const searchUrl=`/?category=${encodeURIComponent(searchQuery)}`;
    window.location.href=searchUrl;
  };
  const handleKeyDown=(e) => {
    if(e.key==='Enter') {
      handleSearch();
    }
  };
  useEffect(() => {
    const handleOutsideClick=(event) => {
      if(userMenuRef.current&&!userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mouseup",handleOutsideClick);
    return () => {
      document.removeEventListener("mouseup",handleOutsideClick);
    };
  },[]);

  return (
    <nav
      className={`border-b-[1.4px] border-[#f1f1f1] sticky top-0 z-[99] bg-white ${inBookingPage&&"hidden md:block"
        }`}
    >
      <div
        className={`xl:px-10 py-4 xl:mx-auto items-center px-5 relative ${inUserProfile||
          inUserDashboard||
          inHostHomesLandingPage||
          inListingDetailsPage
          ? " max-w-screen-xl"
          :" max-w-screen-2xl"
          }
        ${inUserDashboard||inHostHomesLandingPage
            ? "flex flex-row justify-between"
            :"grid grid-cols-2 lg:grid-cols-3 gap-2"
          }
        ${inHostHomesLandingPage? " xl:px-20":""}
        `}
      >
        {/* logo */}
        <div className=" md:w-[160px]">
          <span className="flex flex-row gap-2 items-center">
            <img
              src="https://hotelbox.in/wp-content/uploads/2022/03/HotelBoxlogo.png"
              alt="Logo"
              className=" w-30 cursor-pointer"
              onClick={() => {
                // setting cat to house for listing data fetching
                JSON.stringify(localStorage.setItem("category","House"));
                // manually navigating bcz of avoiding asyncrounous nature and on click show default listing data
                navigate("/");
              }}
            />
            {/* if user is in hosting homes page we want only logo */}

          </span>

        </div>
        {/* if not in the booking page then show the options 👇 */}
        {inBookingPage? (
          <div> </div>
        ):(
          <>
            {/* searchbar */}
            {inUserProfile||inUserDashboard||inHostHomesLandingPage? (
              // if user is in dahsboard
              <div>{inUserDashboard&&<MiniNavbar />} </div>
            ):(
              <div className="mx-auto lg:block hidden" >
                <div className="border-[1px] border-[#dddddd] rounded-full px-3 py-2 flex items-center shadow hover:shadow-md transition-all cursor-pointer">
                  <input
                    type="search"
                    className=" focus:outline-none pl-2"
                    style={{
                      borderRadius: '20px',
                      height: '30px',
                      marginRight: '8px',
                    }}
                    placeholder="Search for places"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <div className="bg-[#FFB724] rounded-full p-2" onClick={handleSearch}>
                    <img src={searchIcon} alt="Search hotel" className="w-4" />
                  </div>
                </div>
              </div>

            )}
          </>
        )}
        {/* if in the booking page don't show any option 👇  */}
        {inBookingPage? (
          <div> </div>
        ):(
          <>
            {/* if user is in the hosting house landing page we want to show different button */}
            {inHostHomesLandingPage? (
              <div className=" flex flex-row items-center justify-between gap-4">
                <p className=" text-[#222222] text-sm font-medium hidden sm:block">
                  ready to rent it?
                </p>
                <Link
                  to="/become-a-host"
                  className=" flex flex-row justify-between items-center gap-2 bg-[#FFB724] hover:bg-[#d90b63] transition-all duration-300 px-3 py-2 rounded-lg"
                >
                  <img src={house} alt="House setup" className=" w-4 md:w-5" />
                  <p className=" font-semibold text-sm md:text-base text-white">
                    Rent Setup
                  </p>
                </Link>
              </div>
            ):(
              <>
                {/* user bar */}
                <div className="flex justify-end items-center">
                  <div className=" px-2">
                    {/* <SelectCities></SelectCities> */}
                  </div>
                  <div
                    className="border-[1px] border-[#dddddd] rounded-full py-1 px-2 flex flex-row gap-3 hover:shadow-md transition-all cursor-pointer relative"
                    onClick={() => {
                      setShowUserMenu((prevValue) => !prevValue);
                    }}
                  >
                    <img
                      src={hamburgerMenu}
                      alt="Motel user menu"
                      className="w-4"
                    />
                    {user? (
                      <p className=" bg-[#222222] text-[#efefef] px-3 py-2 rounded-full text-xs">
                        {user.name?.firstName?.slice(0,1)}
                      </p>
                    ):(
                      <img
                        src={userProfile}
                        alt="user profile icon"
                        className="w-8"
                      />
                    )}
                  </div>

                  {/* menu items code  */}

                  {showUserMenu? (
                    <>
                      {!user? (
                        <div
                          ref={userMenuRef}
                          className="shadow-md absolute right-9 top-[74px] bg-[#ffffff] border-[1px] border-[#dddddd] rounded-lg flex flex-col py-2 w-[230px] transition-all user__menu"
                        >
                          <Link
                            className="font-medium"
                            onClick={() => {
                              setShowUserMenu(false);
                              setPopup(true);
                            }}
                          >
                            Sign up
                          </Link>
                          <Link
                            onClick={() => {
                              setShowUserMenu(false);
                              setPopup(true);
                            }}
                          >
                            Login
                          </Link>
                          <hr className="h-[1.5px] bg-[#dddddd] my-1" />
                          {/* <Link>Rent Your Place</Link> */}
                          <Link>Help</Link>
                        </div>
                      ):(
                        // logged in user menu
                        <div
                          ref={userMenuRef}
                          className="shadow-md absolute right-9 top-[70px] bg-[#ffffff] border-[1px] border-[#dddddd] rounded-lg flex flex-col py-2 w-[230px] transition-all user__menu"
                          onClick={() => {
                            setShowUserMenu((prev) => !prev);
                          }}
                        >
                          {user?.role==="host"||user?.role==="admin"? (
                            <>
                              {!inUserDashboard? (
                                <Link
                                  to={`/users/dashboard/${user._id}/listing=true`}
                                  onClick={() => {
                                    JSON.stringify(
                                      sessionStorage.setItem("activePage",1)
                                    );
                                  }}
                                  className="font-medium"
                                >
                                  Dashboard
                                </Link>
                              ):(
                                <Link className="font-medium" to={"/"}>
                                  Home
                                </Link>
                              )}
                            </>
                          ):(
                            <Link className="font-medium">Notifications</Link>
                          )}
                          {/* <Link className="font-medium">Trips</Link> */}
                          {/* <Link className="font-medium">Wishlists</Link> */}
                          <hr className="h-[1.5px] bg-[#dddddd] my-1" />
                          {user?.emailId?.split('@')[1]=='hotelbox.in' && 
                              <Link to={"/host/homes"}>Rent Your Place</Link>
                          }
                           {user?.emailId?.split('@')[1]=='hotelbox.in' && 
                              <Link to={"/agents"}>Agents List</Link>
                          }
                          <Link to={`/users/show/${user._id}`}>Account <p className="font-light">{user.emailId}</p></Link>
                          <hr className="h-[1.5px] bg-[#dddddd] my-1" />
                          <Link>Help</Link>
                          <Link
                            onClick={() => {
                              handleLogout();
                            }}
                          >
                            Log out
                          </Link>
                        </div>
                      )}
                    </>
                  ):null}
                </div>
              </>
            )}
          </>
        )}
      </div>
      <AuthenticationPopUp popup={popup} setPopup={setPopup} />
    </nav>
  );
};

export default Navbar;
