import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const navigate = useNavigate();

  const [trains, setTrains] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    number: "",
    from: "",
    to: "",
    departure: "",
    arrival: "",
  });

  // 🔐 Protect Admin Route
  useEffect(() => {
    const isAdmin = localStorage.getItem("adminLoggedIn");

    if (!isAdmin) {
      navigate("/adminlogin");
    }

    const storedTrains =
      JSON.parse(localStorage.getItem("trains")) || [];
    setTrains(storedTrains);
  }, []);

  // Generate next 7 available dates
  const generateNext7Days = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d.toISOString().split("T")[0]);
    }
    return dates;
  };

  const saveToStorage = (data) => {
    localStorage.setItem("trains", JSON.stringify(data));
    setTrains(data);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.number ||
      !form.from ||
      !form.to ||
      !form.departure ||
      !form.arrival
    ) {
      alert("Please fill all fields");
      return;
    }

    if (editingId) {
      // Update train
      const updated = trains.map((t) =>
        t.id === editingId ? { ...t, ...form } : t
      );

      saveToStorage(updated);
      setEditingId(null);
    } else {
      // Add new train
      const newTrain = {
        id: Date.now(),
        ...form,
        availableDates: generateNext7Days(),
      };

      saveToStorage([...trains, newTrain]);
    }

    // Reset form
    setForm({
      name: "",
      number: "",
      from: "",
      to: "",
      departure: "",
      arrival: "",
    });
  };

  const handleEdit = (train) => {
    setForm({
      name: train.name,
      number: train.number,
      from: train.from,
      to: train.to,
      departure: train.departure,
      arrival: train.arrival,
    });

    setEditingId(train.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Delete this train?")) return;

    const filtered = trains.filter((t) => t.id !== id);
    saveToStorage(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminLoggedIn");
    navigate("/adminlogin");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* Header */}
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl font-bold">
          👑 Admin Train Management
        </h2>

        <div className="flex gap-3">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Add / Update Form */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="font-semibold mb-4">
          {editingId ? "Update Train" : "Add New Train"}
        </h3>

        <form onSubmit={handleSubmit} className="grid gap-4">

          <input
            placeholder="Train Name"
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            className="p-2 border rounded"
          />

          <input
            placeholder="Train Number"
            value={form.number}
            onChange={(e) =>
              setForm({ ...form, number: e.target.value })
            }
            className="p-2 border rounded"
          />

          <input
            placeholder="From"
            value={form.from}
            onChange={(e) =>
              setForm({ ...form, from: e.target.value })
            }
            className="p-2 border rounded"
          />

          <input
            placeholder="To"
            value={form.to}
            onChange={(e) =>
              setForm({ ...form, to: e.target.value })
            }
            className="p-2 border rounded"
          />

          <input
            placeholder="Departure Time"
            value={form.departure}
            onChange={(e) =>
              setForm({ ...form, departure: e.target.value })
            }
            className="p-2 border rounded"
          />

          <input
            placeholder="Arrival Time"
            value={form.arrival}
            onChange={(e) =>
              setForm({ ...form, arrival: e.target.value })
            }
            className="p-2 border rounded"
          />

          <button className="bg-green-600 text-white p-2 rounded">
            {editingId ? "Update Train" : "Add Train"}
          </button>
        </form>
      </div>

      {/* Train List */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-semibold mb-4">
          All Trains
        </h3>

        {trains.length === 0 ? (
          <p>No trains added yet.</p>
        ) : (
          trains.map((train) => (
            <div
              key={train.id}
              className="border p-4 rounded mb-3"
            >
              <h4 className="font-bold">
                {train.name} ({train.number})
              </h4>

              <p>
                {train.from} → {train.to}
              </p>

              <p>
                {train.departure} - {train.arrival}
              </p>

              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => handleEdit(train)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    handleDelete(train.id)
                  }
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

