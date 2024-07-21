import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import StructureCard from "../../components/listingHouse/StructureCard";
import PhotosCardHotelRoom from "./PhotosCardHotelRoom";
import {
  MdOutlineKingBed,
  MdOutlineBathtub,
  MdOutlineShower,
  MdOutlineWifi,
  MdOutlineAirlineSeatReclineNormal,
  MdOutlineRestaurantMenu
} from 'react-icons/md';

import {
    PiTelevisionSimple,
    PiCampfireLight,
    PiFireExtinguisher,
  } from "react-icons/pi";
const HotelRooms = ({ setRoomsTop }) => {
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editRoomIndex, setEditRoomIndex] = useState(null);
  const newHouseData = useSelector((state) => state.house.newHouse);
  const dispatch = useDispatch();

  const addRoom = (room) => {
    if (editRoomIndex !== null) {
      const updatedRooms = [...rooms];
      updatedRooms[editRoomIndex] = room;
      setRooms(updatedRooms);
      setRoomsTop(updatedRooms);
      setEditRoomIndex(null);
    } else {
      const updatedRooms = [...rooms, room];
      setRooms(updatedRooms);
      setRoomsTop(updatedRooms);
    }
    setShowForm(false);
  };

  const deleteRoom = (index) => {
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
    setRoomsTop(updatedRooms);
  };

  const editRoom = (index) => {
    setEditRoomIndex(index);
    setShowForm(true);
  };

  return (
    <div className="hotel-rooms p-6">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-blue-600 mb-4"
      >
        {showForm ? 'Cancel' : 'Add New Room'}
      </button>
      {showForm && (
        <AddRoomForm
          onAddRoom={addRoom}
          setShowForm={setShowForm}
          editRoomData={editRoomIndex !== null ? rooms[editRoomIndex] : null}
        />
      )}
      {!showForm && rooms.length > 0 && (
        <div className="rooms-list grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-6">
          {rooms.map((room, index) => (
            <div key={index} className="room-card bg-white rounded-lg shadow-md p-6 relative">
              <h3 className="text-xl font-semibold mb-2">{room.roomType}</h3>
              <p className="mb-2"><strong>Base Price:</strong> Rs. {room.basePrice}</p>
              <div className="amenities mb-4">
                <strong>Amenities:</strong>
                <ul className="list-disc ml-5">
                  {room.amenities.map((amenity, idx) => (
                    <li key={idx}>{amenity}</li>
                  ))}
                </ul>
              </div>
              <div className="photos grid grid-cols-3 gap-2 mb-4">
                {room.photos.map((photo, idx) => (
                  <img
                    key={idx}
                    src={photo}
                    alt={`Room ${index + 1} Photo ${idx + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => editRoom(index)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded-md transition duration-300 hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteRoom(index)}
                  className="bg-red-500 text-white px-2 py-1 rounded-md transition duration-300 hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const AddRoomForm = ({ onAddRoom, setShowForm, editRoomData }) => {
  const [roomType, setRoomType] = useState(editRoomData ? editRoomData.roomType : '');
  const [basePrice, setBasePrice] = useState(editRoomData ? editRoomData.basePrice : '');
  const [amenities, setAmenities] = useState(editRoomData ? editRoomData.amenities : []);
  const [photos, setPhotos] = useState(editRoomData ? editRoomData.photos : []);
  const svgSize = window.innerWidth < 768 ? 28 : 40;

  const roomAmenities = [
    { name: 'King Bed', icon: MdOutlineKingBed },
    { name: 'Queen Bed', icon: MdOutlineKingBed },
    { name: 'Shower', icon: MdOutlineShower },
    { name: 'Bathtub', icon: MdOutlineBathtub },
    { name: 'Television', icon: PiTelevisionSimple },
    { name: 'Wi-Fi', icon: MdOutlineWifi },
    { name: 'Air Conditioning', icon: MdOutlineAirlineSeatReclineNormal },
    { name: 'Breakfast', icon: MdOutlineRestaurantMenu }
  ];

  const addAmeneties = (name) => {
    if (amenities.includes(name)) {
      setAmenities(amenities.filter(amenity => amenity !== name));
    } else {
      setAmenities([...amenities, name]);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRoom({
      roomType,
      basePrice: parseInt(basePrice, 10),
      amenities,
      photos: photos.filter(photo => photo !== '')
    });
    setRoomType('');
    setBasePrice('');
    setAmenities([]);
    setPhotos([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <form onSubmit={handleSubmit} className="add-room-form mt-6 bg-gray-100 p-6 rounded-lg shadow-md">
      <div className="form-group mb-4">
        <label className="block text-gray-700">Room Type:</label>
        <input
          type="text"
          value={roomType}
          onChange={(e) => setRoomType(e.target.value)}
          required
          className="w-full mt-2 p-2 border rounded-md"
        />
      </div>
      <div className="form-group mb-4">
        <label className="block text-gray-700">Base Price:</label>
        <input
          type="number"
          value={basePrice}
          onChange={(e) => setBasePrice(e.target.value)}
          required
          className="w-full mt-2 p-2 border rounded-md"
        />
      </div>
      <div className="form-group mb-4">
        <label className="block text-gray-700">Amenities: </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
          {roomAmenities.map((amenity, index) => (
            <StructureCard
              key={index}
              style={amenitisCardStyle}
              Img={amenity.icon}
              name={amenity.name}
              onClick={addAmeneties}
              storedCardData={amenities}
              svgSize={svgSize}
              ptagStyle={amenitesPtagClass}
            />
          ))}
        </div>
      </div>
      <div className="form-group mb-4">
        <label className="block text-gray-700">Photos:</label>
        <PhotosCardHotelRoom setPhotos={setPhotos} />
      </div>
      <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md transition duration-300 hover:bg-green-600">
        {editRoomData ? 'Update Room' : 'Add Room'}
      </button>
    </form>
  );
}

// Styles for StructureCard component
const amenitisCardStyle =
  "flex flex-col items-center gap-2 px-4 py-3 rounded-xl transition-transform duration-300 h-[120px] w-[150px] sm:w-[120px] cursor-pointer justify-center bg-white shadow-md hover:shadow-lg hover:scale-105";
const amenitesPtagClass = "text-[#222222] text-base md:text-sm font-medium";

export default HotelRooms;
