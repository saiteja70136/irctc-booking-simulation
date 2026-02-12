// Generate next 7 days
const getNext7Days = () => {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }
  return dates;
};

const next7Days = getNext7Days();

const trains = [
  {
    id: 1,
    name: "Godavari Express",
    number: "12728",
    from: "Hyderabad",
    to: "Vijayawada",
    departure: "06:00 AM",
    arrival: "11:00 AM",
    availableDates: next7Days,
  },
  {
    id: 2,
    name: "Krishna Express",
    number: "17406",
    from: "Vijayawada",
    to: "Hyderabad",
    departure: "05:30 PM",
    arrival: "10:30 PM",
    availableDates: next7Days.slice(0, 5),
  },
  {
    id: 3,
    name: "Charminar Express",
    number: "12760",
    from: "Chennai",
    to: "Hyderabad",
    departure: "06:10 PM",
    arrival: "06:30 AM",
    availableDates: next7Days.slice(2, 7),
  },
  {
    id: 4,
    name: "Chennai Express",
    number: "12604",
    from: "Hyderabad",
    to: "Chennai",
    departure: "04:00 PM",
    arrival: "05:00 AM",
    availableDates: next7Days,
  },
  {
    id: 5,
    name: "AP Special",
    number: "17001",
    from: "Hyderabad",
    to: "Andhra Pradesh",
    departure: "09:00 AM",
    arrival: "03:00 PM",
    availableDates: next7Days.slice(1, 6),
  },
  {
    id: 6,
    name: "AP Return Express",
    number: "17002",
    from: "Andhra Pradesh",
    to: "Hyderabad",
    departure: "07:00 PM",
    arrival: "01:00 AM",
    availableDates: next7Days.slice(0, 4),
  },
];
export default trains;
 