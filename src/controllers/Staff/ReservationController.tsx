import { useState, useEffect, useMemo } from "react";
import ReservationDetailModel from "@/models/ReservationDetailModel";
import { fetchReservations, updateReservation, updatePayment } from "@/services/api";

export const useReservationController = () => {
  const [reservations, setReservations] = useState<ReservationDetailModel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // State for status filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationDetailModel | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const fetchedReservations: ReservationDetailModel[] = await fetchReservations();
        setReservations(fetchedReservations);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setError("Failed to load reservations. Please try again later.");
        setLoading(false);
      }
    };

    loadReservations();
  }, []);

  const handleSearch = () => {
    const filteredReservations = reservations.filter(
      (reservation) =>
        reservation?.customer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (statusFilter === "" || reservation?.status === statusFilter)
    );
    setReservations(filteredReservations);
  };

  const handleDetail = (reservation: ReservationDetailModel) => {
    setSelectedReservation(reservation);
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirmDialog = () => {
    setConfirmDialogOpen(false);
    setSelectedReservation(null);
  };

  const handleConfirmReservation = async () => {
    if (!selectedReservation) return;

    try {
      const updateData: any = {
        status: "Confirmed",
      };

      const updatedReservation = await updateReservation(selectedReservation._id, updateData);
      const updatedReservationDetail = new ReservationDetailModel(updatedReservation);

      setReservations((prev) =>
        prev.map((res) => (res._id === updatedReservationDetail._id ? updatedReservationDetail : res))
      );
      setSnackbarMessage(`Confirmed reservation with ID: ${selectedReservation._id || "null"}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to confirm reservation", error);
      setSnackbarMessage("Failed to confirm reservation. Please try again.");
      setSnackbarOpen(true);
    } finally {
      handleCloseConfirmDialog();
    }
  };

  const handleCancelReservation = async () => {
    if (!selectedReservation) return;

    try {
      const updateData: any = {
        status: "Cancelled",
      };

      if (selectedReservation.type === "Delivery") {
        updateData.deliveryAddress = selectedReservation.deliveryAddress || null;
        updateData.contactNumber = selectedReservation.contactNumber || null;
      }

      const updatedReservation = await updateReservation(selectedReservation._id, updateData);
      const updatedReservationDetail = new ReservationDetailModel(updatedReservation);

      setReservations((prev) =>
        prev.map((res) => (res._id === updatedReservationDetail._id ? updatedReservationDetail : res))
      );
      setSnackbarMessage(`Cancelled reservation with ID: ${selectedReservation._id || "null"}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to cancel reservation", error);
      setSnackbarMessage("Failed to cancel reservation. Please try again.");
      setSnackbarOpen(true);
    } finally {
      handleCloseConfirmDialog();
    }
  };

  const handleConfirmPayment = async () => {
    if (!selectedReservation || !selectedReservation.payment?._id) {
      console.error("Invalid payment details:", selectedReservation?.payment);
      setSnackbarMessage("Invalid payment details. Please try again.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const paymentUpdateResponse = await updatePayment(
        selectedReservation.payment._id,
        selectedReservation.payment.amount || 0,
        selectedReservation.payment.paymentMethod || "credit-card",
        "Paid"
      );

      if (!paymentUpdateResponse.success) {
        throw new Error("Failed to update payment status.");
      }

      const updateData: any = {
        paymentStatus: "Paid",
      };

      const updatedReservation = await updateReservation(selectedReservation._id, updateData);
      const updatedReservationDetail = new ReservationDetailModel(updatedReservation);

      setReservations((prev) =>
        prev.map((res) => (res._id === updatedReservationDetail._id ? updatedReservationDetail : res))
      );

      setSnackbarMessage(`Confirmed payment for reservation with ID: ${selectedReservation._id || "null"}`);
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to confirm payment", error);
      setSnackbarMessage("Failed to confirm payment. Please try again.");
      setSnackbarOpen(true);
    } finally {
      handleCloseConfirmDialog();
    }
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedReservations = useMemo(() => {
    const startIndex = page * rowsPerPage;
    return reservations.slice(startIndex, startIndex + rowsPerPage);
  }, [reservations, page, rowsPerPage]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return {
    reservations,
    searchTerm,
    statusFilter,
    loading,
    error,
    page,
    rowsPerPage,
    confirmDialogOpen,
    selectedReservation,
    snackbarOpen,
    snackbarMessage,
    setSearchTerm,
    setStatusFilter,
    handleSearch,
    handleDetail,
    handleCloseConfirmDialog,
    handleConfirmReservation,
    handleCancelReservation,
    handleConfirmPayment,
    handleChangePage,
    handleChangeRowsPerPage,
    displayedReservations,
    handleSnackbarClose,
  };
};
