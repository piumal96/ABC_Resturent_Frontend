import { useState, useEffect } from 'react';
import { getOffers, deleteOffer, createOffer } from '@/services/api';
import { OfferModel } from '@/models/OfferModel';

export const useOfferController = () => {
  const [offers, setOffers] = useState<OfferModel[]>([]);
  const [open, setOpen] = useState(false);
  const [newOffer, setNewOffer] = useState({
    title: '',
    description: '',
    discountPercentage: 0,
    validFrom: '',
    validTo: '',
  });

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const fetchedOffers = await getOffers();
        setOffers(fetchedOffers);
      } catch (error) {
        console.error('Error fetching offers:', error);
      }
    };

    fetchOffers();
  }, []);

  const handleAdd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewOffer({
      title: '',
      description: '',
      discountPercentage: 0,
      validFrom: '',
      validTo: '',
    });
  };

  const handleSave = async () => {
    try {
      const createdOffer = await createOffer(newOffer);
      setOffers([...offers, createdOffer.offer]);
      handleClose();
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteOffer(id);
      setOffers(offers.filter((offer) => offer._id !== id));
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  };

  return {
    offers,
    open,
    newOffer,
    setNewOffer,
    handleAdd,
    handleClose,
    handleSave,
    handleDelete,
  };
};
