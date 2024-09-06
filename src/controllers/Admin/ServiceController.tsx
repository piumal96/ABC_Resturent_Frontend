import { useState, useEffect } from "react";
import { getServices, createService, updateService, deleteService } from "@/services/api";
import { ServiceModel } from "@/models/ServiceModel";

export const useServiceController = () => {
  const [services, setServices] = useState<ServiceModel[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
  const [editingService, setEditingService] = useState<ServiceModel | null>(null);
  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: 0,
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const fetchedServices = await getServices();
        setServices(fetchedServices);
      } catch (error) {
        setSnackbarMessage("Error fetching services");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", description: "", price: "" };

    if (newService.name.trim() === "") {
      newErrors.name = "Service name is required";
      valid = false;
    }
    if (newService.description.trim() === "") {
      newErrors.description = "Description is required";
      valid = false;
    }
    if (newService.price <= 0) {
      newErrors.price = "Price must be greater than 0";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleEdit = (service: ServiceModel) => {
    setEditingService(service);
    setNewService({
      name: service.name,
      description: service.description,
      price: service.price,
    });
    setErrors({ name: "", description: "", price: "" });
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteService(id);
      setServices((prevServices) => prevServices.filter((service) => service._id !== id));
      setSnackbarMessage("Service deleted successfully");
      setSnackbarSeverity("success");
    } catch (error) {
      setSnackbarMessage("Error deleting service");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingService(null);
    setNewService({ name: "", description: "", price: 0 });
    setErrors({ name: "", description: "", price: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (editingService) {
        const updatedService = await updateService(editingService._id, newService);
        setServices((prevServices) =>
          prevServices.map((service) => (service._id === updatedService._id ? updatedService : service))
        );
        setSnackbarMessage("Service updated successfully");
        setSnackbarSeverity("success");
      } else {
        const createdService = await createService(newService);
        setServices((prevServices) => [...prevServices, createdService.service]);
        setSnackbarMessage("Service created successfully");
        setSnackbarSeverity("success");
      }
      setOpen(false);
    } catch (error) {
      setSnackbarMessage("Error saving service");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true);
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return {
    services,
    open,
    loading,
    snackbarOpen,
    snackbarMessage,
    snackbarSeverity,
    editingService,
    newService,
    errors,
    setNewService,
    handleAdd,
    handleEdit,
    handleDelete,
    handleClose,
    handleSave,
    handleSnackbarClose,
  };
};
