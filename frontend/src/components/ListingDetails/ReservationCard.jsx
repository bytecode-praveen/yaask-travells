import { useEffect, useRef, useState } from "react";
import { AiFillStar, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import { DateRange } from "react-date-range";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import emailjs from '@emailjs/browser';

// date range selector css
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css";
import { useDispatch, useSelector} from "react-redux";
import { newReservation } from "../../redux/actions/reservationsActions";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API } from "../../backend";
import { parseISO } from "date-fns";

/* eslint-disable react/prop-types */
const ReservationCard = ({ listingData, selectedRoom }) => {
  // refs
  const calendarRef = useRef();
  const dropdownRef = useRef();
  const user = useSelector((state) => state.user.userDetails);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // handling outside click
  const { state: calendarState, setState: setCalendarState } =
    useOutsideClick(calendarRef);
  const { state: showDropdown, setState: setShowDropdown } =
    useOutsideClick(dropdownRef);

  // guests state is here
  const [guestsNumber, setGuestsNumber] = useState(1);
  const [childrenNumber, setChildrenNumber] = useState(0);
  const [totalGuest, setTotalGuest] = useState(guestsNumber + childrenNumber);
  const [reservations, setReservations] = useState([]);
  // pricing state
  const [reservationBasePrice, setReservationBasePrice] = useState(
    selectedRoom?.basePrice
  );
  const [tax, setTax] = useState(
    selectedRoom?.priceAfterTaxes - selectedRoom?.basePrice
  );
 

  // dates saving and showing to the dateRange calendar calculation here
  const [selectedDates, setSelectedDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  // calculating how many nights guest is staying
  const [nightsStaying, setNightStaying] = useState(1);

  // //console.log(nightsStaying, typeof nightsStaying, "nights");

  // formatted dates to save in the db
  const formattedStartDate = selectedDates[0]?.startDate?.toISOString();
  const formattedEndDate = selectedDates[0]?.endDate?.toISOString();

  // local dates from fromatted date to show in the ui
  const localStartDate = new Date(formattedStartDate).toLocaleDateString();
  const localEndDate = new Date(formattedEndDate).toLocaleDateString();

  // //console.log(
  //   new Date(formattedStartDate).toLocaleDateString(),
  //   localStartDate,
  //   localEndDate,
  //   "dates"
  // );
  // Function to handle date selection
  const handleSelect = (ranges) => {
    setSelectedDates([ranges.selection]);
  };


  const handleBooking = () => {
    //console.log("Selected room:" +selectedRoom.roomType);
    //console.log("nightsStaying:" +nightsStaying);
    //console.log("totalGuest:" +totalGuest);
    //console.log("reservationBasePrice:" +reservationBasePrice);
    //console.log("selectedDates:" + localStartDate + " to "+ localEndDate);
  };

  // getting saved reservations data
 

  // calculation of price for reservations
  // side effects and logic
  useEffect(() => {
    const daysInMiliSec = Math.ceil(
      selectedDates[0]?.endDate - selectedDates[0]?.startDate
    );
    // turning miliseconds into days
    const calculatedNights = daysInMiliSec / (1000 * 60 * 60 * 24);
    const finalNights = calculatedNights === 0 ? 1 : calculatedNights;
    const calculatedBasePrice = selectedRoom?.basePrice * finalNights;
    // tax is 14%
    const calculatingTaxes = Math.round((calculatedBasePrice * 14) / 100);
    

    // setting states
    setReservationBasePrice(calculatedBasePrice);
    setTax(calculatingTaxes);
    setNightStaying(calculatedNights);
  }, [selectedDates, selectedRoom?.basePrice]);

  useEffect(() => {
    setTotalGuest(guestsNumber + childrenNumber);
  }, [guestsNumber, childrenNumber]);

  // reservation data
  useEffect(() => {
    const data = {
      listingData,
      formattedStartDate,
      formattedEndDate,
      nightsStaying,
      totalGuest,
      reservationBasePrice,
      tax,
    };
    dispatch(newReservation(data));
  }, [
    dispatch,
    listingData,
    formattedStartDate,
    formattedEndDate,
    nightsStaying,
    totalGuest,
    reservationBasePrice,
    tax,
  ]);

  // Calculate the disabled date ranges for each object
  const disabledDateRanges = reservations?.map((obj) => ({
    startDate: parseISO(obj.checkIn),
    endDate: parseISO(obj.checkOut),
  }));

  // //console.log(disabledDateRanges);

  // Generate an array of individual dates within disabledDateRanges
  const disabledDates = disabledDateRanges.reduce((dates, range) => {
    const startDate = new Date(range.startDate);
    const endDate = new Date(range.endDate);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, []);

  const message = `🎉 *Congratulations!* Your booking request has been received. 🎉\n\n🏨 *Room Type*: ${selectedRoom?.roomType}\n🏨 *Total Guest*: ${totalGuest}\n💵 *Base Price*: Rs. ${selectedRoom?.basePrice}\n📅 *Dates*: ${localStartDate} to ${localEndDate}\n🔗 *Booking Link*: ${window.location.href}\n\nWe will connect you for further for more details. 🌟`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
  const handleClick = (e) => {
    if (!user || !selectedRoom) {
      e.preventDefault(); // Prevent the default action
    }
    emailjs
    .send('service_1na35xq', 'template_wnez5qg', {
        title: selectedRoom.title,
        message: message,
    }, { publicKey: 'P7gtl5wQi47djtYx7' })
    .then(() => {
        setSentSuccessfully(true)
    })
    .catch((error) => {
        console.error('Error sending email to admin:', error);
        setErrorOccurred(true);
    });
  };
  return (
    <>
      <div className=" w-full min-h-[315px] rounded-xl border border-[#dddddd] sticky top-32 shadow-customShadow p-6">
        <div className=" flex felx-row justify-between items-start">
          <div className=" flex flex-col">
          {user? (
             <div>
                <h3 className=" text-[22px] text-[#222222] font-semibold">
                {selectedRoom?selectedRoom.roomType:"Select a room"} 
                </h3>
                <p>Rs. {selectedRoom?selectedRoom.basePrice:"-"}</p>
                <p className=" text-[#313131] text-sm">Total before taxes</p>
              </div>
            ) : (
              <p className="text-xs sm:text-sm font-medium underline">
                Login to see price 
              </p>
              
            )}
            {}
          </div>
          <span className=" text-sm text-[#222222] flex flex-row gap-1 items-center mt-2">
            <AiFillStar size={18} />
            {listingData?.ratings ? listingData?.ratings : "New"}
            {listingData?.reviews && (
              <span>
                <span>·</span>
                <span>{listingData?.reviews}</span>
              </span>
            )}
          </span>
        </div>
        {/* calender section */}

        {!calendarState && (
          <div className=" rounded-tl-lg rounded-tr-lg border border-[#b9b9b9] w-full min-h-[60px] mt-6 relative flex flex-col">
            {/* dates & calendar & guests here */}
            <div>
              <div
                onClick={() => {
                  setCalendarState(true);
                }}
                className=" grid grid-cols-2 cursor-pointer"
              >
                <div className="px-3 py-3">
                  <p className=" text-[10px] text-black font-semibold uppercase">
                    check-in
                  </p>
                  <p className=" text-sm text-[#222222]">{localStartDate}</p>
                </div>
                <div className="px-3 py-3 border-l border-[#b9b9b9]">
                  <p className=" text-[10px] text-black font-semibold uppercase">
                    checkout
                  </p>
                  <p className=" text-sm text-[#222222]">{localEndDate}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* guest selection */}

        {!calendarState && (
          <div
            ref={dropdownRef}
            onClick={() => {
              setShowDropdown((prev) => !prev);
            }}
          >
            <div className=" rounded-bl-lg rounded-br-lg border border-[#b9b9b9] w-full min-h-[50px] cursor-pointer relative">
              {/* guests data */}
              <div className="px-3 py-3 flex flex-row items-center justify-between">
                <div className=" flex flex-col">
                  <p className=" text-[10px] text-black font-semibold uppercase">
                    guests
                  </p>
                  <p className=" text-sm text-[#222222]">
                    {totalGuest} {totalGuest === 1 ? "guest" : "guests"}
                  </p>
                </div>
                <div>
                  {showDropdown ? (
                    <MdKeyboardArrowUp size={26} />
                  ) : (
                    <MdKeyboardArrowDown size={26} />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* guests data dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="min-h-[200px] w-72 shadow-lg border absolute z-[90] bg-white px-4 py-5 rounded-md"
          >
            <div className=" flex flex-col gap-5">
              <div className=" flex felx-row items-center justify-between">
                {/* adults number here */}
                <span>
                  <p className=" text-base text-[#222222] font-medium">
                    Adults
                  </p>
                  <p className=" text-sm text-[#313131]">Age 13+</p>
                </span>
                {/* icons */}
                <span className=" flex flex-row-reverse items-center gap-2">
                  <button
                    onClick={() => {
                      setGuestsNumber((prev) => prev + 1);
                    }}
                    disabled={listingData?.floorPlan?.guests === totalGuest}
                    className={` p-2 rounded-full border border-[#c0c0c0] opacity-90 disabled:cursor-not-allowed disabled:opacity-20`}
                  >
                    <AiOutlinePlus size={16} />
                  </button>
                  <p className=" w-[30px] flex justify-center">
                    {guestsNumber}
                  </p>

                  <button
                    onClick={() => {
                      setGuestsNumber((prev) => prev - 1);
                    }}
                    disabled={guestsNumber === 1}
                    className=" p-2 rounded-full border border-[#c0c0c0] disabled:cursor-not-allowed disabled:opacity-20"
                  >
                    <AiOutlineMinus size={16} />
                  </button>
                </span>
              </div>
              <div className=" flex felx-row items-center justify-between">
                {/* children number here */}
                <span>
                  <p className=" text-base text-[#222222] font-medium">
                    Children
                  </p>
                  <p className=" text-sm text-[#313131]">Ages 2-12</p>
                </span>
                {/* icons */}
                <span className=" flex flex-row-reverse items-center gap-2">
                  <button
                    onClick={() => {
                      setChildrenNumber((prev) => prev + 1);
                    }}
                    disabled={listingData?.floorPlan?.guests === totalGuest}
                    className=" p-2 rounded-full border border-[#c0c0c0] opacity-90 disabled:cursor-not-allowed disabled:opacity-20"
                  >
                    <AiOutlinePlus size={16} />
                  </button>
                  <p className=" w-[30px] flex justify-center">
                    {childrenNumber}
                  </p>

                  <button
                    onClick={() => {
                      setChildrenNumber((prev) => prev - 1);
                    }}
                    disabled={childrenNumber === 0}
                    className=" p-2 rounded-full border border-[#c0c0c0] disabled:cursor-not-allowed disabled:opacity-20"
                  >
                    <AiOutlineMinus size={16} />
                  </button>
                </span>
              </div>
            </div>
            {/* close btn */}
            <div className=" flex justify-end absolute bottom-3 right-2">
              <button
                onClick={() => {
                  setShowDropdown(false);
                }}
                className="underline text-base text-[#222222] font-medium px-3 py-2 rounded-lg hover:bg-[#f5f5f5]"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* reservation button */}
        {!showDropdown && !calendarState && (
          
          <div className=" mt-6 flex justify-center rounded-md">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className={`mt-4 py-2 px-4 rounded-lg transition text-center inline-block ${
                selectedRoom && user ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
              aria-disabled={!user && !selectedRoom}
              onClick={handleClick}
            >
              {selectedRoom  && user ? 'Book via WhatsApp' : 'Select a room to book'}
            </a>
          </div>
        )}

        {/* calendar & date picker */}
        {!calendarState ? null : (
          <div
            ref={calendarRef}
            className=" absolute border-b-[1.2px] border-neutral-200 shadow-md left-[2px] sm:translate-x-[30%] sm:translate-y-[0%] md:translate-x-[-30%] lg:translate-x-[-20%] xl:translate-x-0 xl:translate-y-0"
          >
            <DateRange
              rangeColors={["#262626"]}
              date={new Date()}
              editableDateInputs={true}
              onChange={handleSelect}
              moveRangeOnFirstSelection={false}
              ranges={selectedDates}
              disabledDates={disabledDates}
              direction="vertical"
              showDateDisplay={false}
              minDate={new Date()}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default ReservationCard;
