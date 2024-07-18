import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import { useSelector} from "react-redux";
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader

const ListingRooms = ({ listingData, onRoomSelect}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState('');
  const user = useSelector((state) => state.user.userDetails);


  const navigate = useNavigate();

  const handleImageClick = (photo) => {
    setCurrentImage(photo);
    setModalOpen(true);
  };
  const selectRoom = (room) => {
     onRoomSelect(room);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentImage('');
  };

  const calculatePriceAfterTaxes = (basePrice) => {
    const taxRate = 0.14; // 14% tax rate
    const taxAmount = basePrice * taxRate;
    return basePrice + taxAmount;
  };

  return (
    <div className="flex flex-col gap-6">
      {listingData?.rooms?.map((room, roomIndex) => (
        <div key={roomIndex} className="border rounded-lg p-6 mb-6 shadow-lg flex flex-col md:flex-row">
          <div className="md:w-1/3 flex-shrink-0 relative">
            <Carousel showArrows={true} showThumbs={false}>
              {room.photos.map((photo, index) => (
                <div key={index} onClick={() => handleImageClick(photo)}>
                  <img
                    src={photo}
                    alt={`Room ${roomIndex + 1} photo`}
                    className="object-cover w-full h-48 md:h-64 rounded-lg cursor-pointer"
                  />
                </div>
              ))}
            </Carousel>
          </div>
          <div className="md:w-2/3 md:pl-6 flex flex-col justify-between">
            <div>
              <h3 className="text-2xl font-semibold mb-2">{room.roomType}</h3>
              <div className="flex items-center mb-4">
                <span className="text-xl mr-2">🏠</span>
                <span className="text-sm">Amenities:</span>
              </div>
              <ul className="list-disc list-inside ml-4 text-xs">
                {room.amenities?.map((amenity, idx) => (
                  <li key={idx} className="text-sm">{amenity}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-2 md:mb-0">
                
                {user? 
                  (<p className="text-lg text-green-600 font-bold mb-1">Base Price: Rs. {room.basePrice}</p>) :
                  ( <p className="text-xs sm:text-sm font-medium underline">
                    Login to see price 
                  </p>)
                } 
                {user? 
                  (<p className="text-sm text-gray-500">Price after Tax: Rs. {calculatePriceAfterTaxes(room.basePrice).toFixed(2)}</p>) :
                  ( <p className="text-xs sm:text-sm font-medium underline">
                    
                  </p>)
                } 
                
              </div>
              <div>
                <button
                  onClick={() => selectRoom(room)}
                  className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  Select
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-2xl w-full relative">
            <span
              className="absolute top-2 right-2 text-xl cursor-pointer"
              onClick={closeModal}
            >
              &times;
            </span>
            <img
              src={currentImage}
              alt="Expanded view"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingRooms;
