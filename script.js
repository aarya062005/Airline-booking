// script.js

let passengerData = {};
let selectedSeats = [];
let selectedFlight = null;

const ticketPrices = {
    "Economy": 3000,
    "Premium Economy": 4500,
    "Business Class": 7000,
    "First Class": 10000
};

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    passengerData = {
        name: document.getElementById("userName").value,
        phone: document.getElementById("userPhone").value,
        email: document.getElementById("userEmail").value,
        from: document.getElementById("from").value,
        to: document.getElementById("to").value,
        classType: document.getElementById("ticketType").value,
        seatCount: parseInt(document.getElementById("seatCount").value)
    };

    document.getElementById("booking").style.display = "none";
    document.getElementById("seatSelection").style.display = "block";

    generateSeats(passengerData.seatCount);
});

function generateSeats(count) {
    const seatsContainer = document.getElementById("seatsContainer");
    seatsContainer.innerHTML = "";
    for (let i = 1; i <= 30; i++) {
        const seat = document.createElement("button");
        seat.textContent = `Seat ${i}`;
        seat.className = "seat";
        seat.onclick = () => selectSeat(i, seat);
        seatsContainer.appendChild(seat);
    }
}

function selectSeat(seatNo, element) {
    if (selectedSeats.includes(seatNo)) {
        selectedSeats = selectedSeats.filter(s => s !== seatNo);
        element.classList.remove("selected");
    } else if (selectedSeats.length < passengerData.seatCount) {
        selectedSeats.push(seatNo);
        element.classList.add("selected");
    }
}

function submitSeatSelection() {
    if (selectedSeats.length !== passengerData.seatCount) {
        alert("Please select all seats required.");
        return;
    }
    document.getElementById("seatSelection").style.display = "none";
    document.getElementById("flightOptions").style.display = "block";
    showFlights();
}

function showFlights() {
    const flights = [
        { name: "SkyJet", number: "SJ101", type: "Boeing 737", departure: "07:00 AM", arrival: "09:00 AM", amenities: ["Wi-Fi", "Entertainment"], price: 15000 },
        { name: "CloudAir", number: "CA202", type: "Airbus A320", departure: "10:00 AM", arrival: "12:00 PM", amenities: ["Meals", "TV"], price: 20000 },
        { name: "FlyHigh", number: "FH303", type: "Boeing 777", departure: "01:00 PM", arrival: "03:00 PM", amenities: ["Wi-Fi"], price: 14500 },
        { name: "JetBlue", number: "JB404", type: "Airbus A350", departure: "04:00 PM", arrival: "06:00 PM", amenities: ["Charging Port"], price: 25000},
        { name: "SkyKing", number: "SK505", type: "Boeing 787", departure: "07:00 PM", arrival: "09:30 PM", amenities: ["Extra Legroom", "Snacks"], price: 30000 }
    ];

    const container = document.getElementById("flightOptions");
    container.innerHTML = `<h2>Select Your Flight</h2>`;

    flights.forEach(flight => {
        const price = ticketPrices[passengerData.classType];
        flight.price = price;
        const div = document.createElement("div");
        div.className = "flight-card";
        div.innerHTML = `
            <h3>${flight.name} - ${flight.number}</h3>
            <p><strong>Aircraft:</strong> ${flight.type}</p>
            <p><strong>Departure:</strong> ${flight.departure}</p>
            <p><strong>Arrival:</strong> ${flight.arrival}</p>
            <p><strong>Amenities:</strong> ${flight.amenities.join(", ")}</p>
            <p><strong>Total Price:</strong> ₹${price * passengerData.seatCount}</p>
            <button onclick='selectFlight(${JSON.stringify(flight)})'>Select</button>
        `;
        container.appendChild(div);
    });
}

function selectFlight(flight) {
    selectedFlight = flight;
    document.getElementById("flightOptions").style.display = "none";
    document.getElementById("extrasForm").style.display = "block";
}

document.getElementById("extraDetailsForm").addEventListener("submit", function (e) {
    e.preventDefault();
    passengerData.isDoctor = document.getElementById("isDoctor").checked;
    passengerData.meal = document.getElementById("meal").value;
    passengerData.mealPrice = passengerData.meal === "Veg" ? 250 : passengerData.meal === "Non-Veg" ? 300 : 0;

    document.getElementById("extrasForm").style.display = "none";
    document.getElementById("paymentSection").style.display = "block";
});

document.getElementById("paymentForm").addEventListener("submit", function (e) {
    e.preventDefault();
    const paymentMode = document.querySelector('input[name="paymentMode"]:checked').value;

    const total = (selectedFlight.price * passengerData.seatCount) + passengerData.mealPrice;
    const details = `
        <p><strong>Name:</strong> ${passengerData.name}</p>
        <p><strong>Phone:</strong> ${passengerData.phone}</p>
        <p><strong>Email:</strong> ${passengerData.email}</p>
        <p><strong>From:</strong> ${passengerData.from} → <strong>To:</strong> ${passengerData.to}</p>
        <p><strong>Flight:</strong> ${selectedFlight.name} (${selectedFlight.number})</p>
        <p><strong>Aircraft:</strong> ${selectedFlight.type}</p>
        <p><strong>Amenities:</strong> ${selectedFlight.amenities.join(", ")}</p>
        <p><strong>Seat(s):</strong> ${selectedSeats.join(", ")}</p>
        <p><strong>Class:</strong> ${passengerData.classType}</p>
        <p><strong>Meal:</strong> ${passengerData.meal}</p>
        <p><strong>Doctor:</strong> ${passengerData.isDoctor ? "Yes" : "No"}</p>
        <p><strong>Payment Mode:</strong> ${paymentMode}</p>
        <h3>Total Amount Paid: ₹${total}</h3>
    `;

    document.getElementById("paymentSection").style.display = "none";
    document.getElementById("confirmation").style.display = "block";
    document.getElementById("confirmationDetails").innerHTML = details;
});
