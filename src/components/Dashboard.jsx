import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [trains, setTrains] = useState([]);
  const [results, setResults] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [searched, setSearched] = useState(false);
  const [searchText,setSearchText] = useState(false)
  const [selectedTrain, setSelectedTrain] = useState(null);
  const [myBookings, setMyBookings] = useState([]);

  const [passenger, setPassenger] = useState({
    name: "",
    age: "",
    gender: "",
    berth: "",
  });

  // 🔐 Protect Dashboard
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    const storedUser =
      JSON.parse(localStorage.getItem("user")) || null;

    const storedTrains =
      JSON.parse(localStorage.getItem("trains")) || [];

    setUser(storedUser);
    setTrains(storedTrains);
    setResults(storedTrains);

    loadBookings(storedUser);
  }, []);

  const loadBookings = (currentUser) => {
    const allBookings =
      JSON.parse(localStorage.getItem("bookings")) || [];

    const userBookings = allBookings.filter(
      (b) => b.bookedBy === currentUser?.email
    );

    setMyBookings(userBookings);
  };

  const handleSearch = () => {
    setSearched(true);

    if (!from && !to && !travelDate) {
      setResults(trains);
      return;
    }

    const filtered = trains.filter((t) => {
      const matchFrom =
        !from || t.from.toLowerCase().includes(from.toLowerCase());

      const matchTo =
        !to || t.to.toLowerCase().includes(to.toLowerCase());

      const matchDate =
        !travelDate ||
        (t.availableDates &&
          t.availableDates.includes(travelDate));

      return matchFrom && matchTo && matchDate;
    });

    setResults(filtered);
    setSearchText(true)
  };

  const handleBookingSubmit = (train) => {
    if (!travelDate) {
      alert("Please select travel date");
      return;
    }

    if (!passenger.name || !passenger.age || !passenger.gender) {
      alert("Please fill passenger details");
      return;
    }

    const bookings =
      JSON.parse(localStorage.getItem("bookings")) || [];

    const newBooking = {
      ...train,
      bookedBy: user.email,
      travelDate,
      passenger,
      bookingDate: new Date().toLocaleString(),
      bookingId: Date.now(),
      pnr: "PNR" + Math.floor(Math.random() * 1000000),
    };

    bookings.push(newBooking);
    localStorage.setItem("bookings", JSON.stringify(bookings));

    alert("Ticket Booked Successfully!");

    setPassenger({
      name: "",
      age: "",
      gender: "",
      berth: "",
    });

    setSelectedTrain(null);
    loadBookings(user);
  };

  const handleCancel = (id) => {
    let bookings =
      JSON.parse(localStorage.getItem("bookings")) || [];

    bookings = bookings.filter((b) => b.bookingId !== id);

    localStorage.setItem("bookings", JSON.stringify(bookings));
    loadBookings(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const today = new Date().toISOString().split("T")[0];
  const maxDate = new Date(
    new Date().setDate(new Date().getDate() + 6)
  )
    .toISOString()
    .split("T")[0];

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">
          🚆 Welcome {user?.name}
        </h2>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex gap-4 flex-wrap">
          <input
            placeholder="From"
            value={from}
            className="p-2 border rounded"
            onChange={(e) => setFrom(e.target.value)}
          />

          <input
            placeholder="To"
            value={to}
            className="p-2 border rounded"
            onChange={(e) => setTo(e.target.value)}
          />

          <input
            type="date"
            value={travelDate}
            min={today}
            max={maxDate}
            className="p-2 border rounded"
            onChange={(e) => setTravelDate(e.target.value)}
          />

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 rounded"
          >
            Search
          </button>
        </div>
      </div>

      {/* Train List */}
      <h3 className="text-xl font-semibold mb-3">
        {searchText ? "Search Results" : "All Available Trains"}
      </h3>
      {trains.length === 0 && (
        <div className="bg-yellow-100 text-yellow-700 p-4 rounded mb-6">
           No trains are added by admin yet.
        </div>
      )}
      {searched && results.length === 0 ? (
        <div className="bg-red-100 text-red-600 p-4 rounded mb-6">
          Not found any trains.
        </div>
      ) : (
        <div className="grid gap-4 mb-8">
          {results.map((train) => (
            <div
              key={train.id}
              className="bg-white p-5 rounded-xl shadow"
            >
              <h3 className="font-bold">
                {train.name} ({train.number})
              </h3>

              <p>{train.from} → {train.to}</p>
              <p>{train.departure} - {train.arrival}</p>

              <button
                onClick={() =>
                  setSelectedTrain(
                    selectedTrain?.id === train.id
                      ? null
                      : train
                  )
                }
                className="mt-3 bg-green-600 text-white px-4 py-1 rounded"
              >
                {selectedTrain?.id === train.id
                  ? "Close"
                  : "Book Ticket"}
              </button>

              {/* Passenger Form */}
              {selectedTrain?.id === train.id && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold mb-3">
                    Passenger Details
                  </h4>

                  {!travelDate && (
                    <input
                      type="date"
                      value={travelDate}
                      min={today}
                      max={maxDate}
                      className="p-2 border rounded mb-3 w-full"
                      onChange={(e) =>
                        setTravelDate(e.target.value)
                      }
                    />
                  )}

                  <input
                    placeholder="Passenger Name"
                    className="p-2 border rounded mb-3 w-full"
                    value={passenger.name}
                    onChange={(e) =>
                      setPassenger({
                        ...passenger,
                        name: e.target.value,
                      })
                    }
                  />

                  <input
                    type="number"
                    placeholder="Age"
                    className="p-2 border rounded mb-3 w-full"
                    value={passenger.age}
                    onChange={(e) =>
                      setPassenger({
                        ...passenger,
                        age: e.target.value,
                      })
                    }
                  />

                  <select
                    className="p-2 border rounded mb-3 w-full"
                    value={passenger.gender}
                    onChange={(e) =>
                      setPassenger({
                        ...passenger,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>

                  <select
                    className="p-2 border rounded mb-3 w-full"
                    value={passenger.berth}
                    onChange={(e) =>
                      setPassenger({
                        ...passenger,
                        berth: e.target.value,
                      })
                    }
                  >
                    <option value="">Berth Preference</option>
                    <option>Lower</option>
                    <option>Middle</option>
                    <option>Upper</option>
                    <option>Side Lower</option>
                    <option>Side Upper</option>
                  </select>

                  <button
                    onClick={() =>
                      handleBookingSubmit(train)
                    }
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    Confirm Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* My Bookings */}
      <h3 className="text-xl font-semibold mb-3">
        🎫 My Booked Tickets
      </h3>

      {myBookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <div className="grid gap-4">
          {myBookings.map((booking) => (
            <div
              key={booking.bookingId}
              className="bg-yellow-50 p-5 rounded-xl shadow"
            >
              <h4 className="font-bold">
                {booking.name} ({booking.number})
              </h4>

              <p>{booking.from} → {booking.to}</p>
              <p>Travel Date: {booking.travelDate}</p>
              <p>Passenger: {booking.passenger.name}</p>
              <p>Age: {booking.passenger.age}</p>
              <p>Gender: {booking.passenger.gender}</p>
              <p>Berth: {booking.passenger.berth}</p>
              <p>PNR: {booking.pnr}</p>

              <button
                onClick={() =>
                  handleCancel(booking.bookingId)
                }
                className="mt-2 bg-red-600 text-white px-4 py-1 rounded"
              >
                Cancel Ticket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
