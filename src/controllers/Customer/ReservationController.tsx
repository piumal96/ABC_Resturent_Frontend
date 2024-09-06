import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { fetchRestaurants, fetchServices, updatePayment, createReservation } from "@/services/api";
import RestaurantModel from "@/models/RestaurantModel";
import { ServiceModel } from "@/models/ServiceModel";
import ReservationModel from "@/models/ReservationModel";

export const useReservationController = () => {
  const [restaurant, setRestaurant] = useState<string>("");
  const [restaurants, setRestaurants] = useState<RestaurantModel[]>([]);
  const [service, setService] = useState<string>("");
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [serviceCost, setServiceCost] = useState<number>(0);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [type, setType] = useState("Dine-in");
  const [specialRequests, setSpecialRequests] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<ReservationModel | null>(null);

  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }

    const loadRestaurantsAndServices = async () => {
      try {
        const fetchedRestaurants = await fetchRestaurants();
        setRestaurants(fetchedRestaurants);

        const fetchedServices = await fetchServices();
        setServices(fetchedServices);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    loadRestaurantsAndServices();
  }, [isAuthenticated, navigate]);

  const handleServiceChange = (serviceId: string) => {
    setService(serviceId);
    const selectedService = services.find((s) => s._id === serviceId);
    if (selectedService) {
      let cost = selectedService.price;
      if (type === "Delivery") {
        const deliveryFee = 10; // Example delivery fee
        cost += deliveryFee;
      }
      setServiceCost(cost);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        throw new Error("You must be logged in to make a reservation.");
      }

      const reservationData: ReservationModel = {
        id: "",
        customer: user.id,
        restaurant,
        service,
        date,
        time,
        type,
        deliveryAddress: type === "Delivery" ? deliveryAddress : undefined,
        contactNumber: type === "Delivery" ? contactNumber : undefined,
        specialRequests,
        status: "Pending",
        createdAt: "",
      };

      const reservation = await createReservation(reservationData);
      if (reservation && type === "Delivery") {
        setCurrentReservation(reservation);
        setPaymentDialogOpen(true);
      } else {
        setFeedback("Reservation created successfully!");
        setSnackbarOpen(true);
      }

      setLoading(false);
    } catch (error) {
      setFeedback("Failed to create reservation. Please try again.");
      setSnackbarOpen(true);
      setLoading(false);
      console.error("Error creating reservation:", error);
    }
  };

  const handlePayment = async (method: string, cardDetails?: { cardNumber: string; expiryDate: string; cvv: string }) => {
    setPaymentDialogOpen(false);
    try {
      if (!currentReservation || !currentReservation.payment) {
        throw new Error("No payment information found. Please try again.");
      }

      const paymentId = currentReservation.payment.id;
      const amount = serviceCost;

      if (method === "Card Payment" && cardDetails) {
        console.log("Processing card payment with details:", cardDetails);
      }

      const paymentResponse = await updatePayment(paymentId, amount, "credit-card", "Paid");

      if (paymentResponse.success) {
        setFeedback("Reservation confirmed and payment processed successfully!");
        setSnackbarOpen(true);

        setCurrentReservation((prev) => {
          if (prev) {
            return { ...prev, status: paymentResponse.payment.status };
          }
          return prev;
        });
      } else {
        setFeedback("Payment processing failed. Please try again.");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setFeedback("Failed to process payment. Please try again.");
      setSnackbarOpen(true);
      console.error("Error processing payment:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
    navigate("/");
  };

  return {
    restaurant,
    restaurants,
    service,
    services,
    serviceCost,
    date,
    time,
    type,
    specialRequests,
    deliveryAddress,
    contactNumber,
    loading,
    snackbarOpen,
    feedback,
    paymentDialogOpen,
    handleServiceChange,
    handleSubmit,
    handlePayment,
    handleSnackbarClose,
    setRestaurant,
    setDate,
    setTime,
    setType,
    setSpecialRequests,
    setDeliveryAddress,
    setContactNumber,
    setPaymentDialogOpen,
  };
};
