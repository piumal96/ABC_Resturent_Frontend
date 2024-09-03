import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  CircularProgress,
} from '@mui/material';

interface PaymentDialogProps {
  open: boolean;
  onClose: () => void;
  totalAmount: number;
  onPayment: (method: string, cardDetails?: { cardNumber: string; expiryDate: string; cvv: string }) => void;
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({ open, onClose, totalAmount, onPayment }) => {
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Validate card inputs
  const isCardPaymentValid = paymentMethod === 'Cash on Delivery' || (cardNumber && expiryDate && cvv);

  const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(event.target.value);
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      if (paymentMethod === 'Card Payment') {
        onPayment(paymentMethod, { cardNumber, expiryDate, cvv });
      } else {
        onPayment(paymentMethod);
      }
      setIsProcessing(false);
    }, 2000); // Simulate processing time
  };

  useEffect(() => {
    if (open && paymentMethod === 'Card Payment') {
      // Autofocus on the card number field when payment method is "Card Payment"
      const cardNumberField = document.getElementById('card-number');
      cardNumberField?.focus();
    }
  }, [open, paymentMethod]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Complete Your Payment</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please choose your payment method and complete the payment for your reservation.
        </DialogContentText>
        <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
          Total Amount: <strong>${totalAmount.toFixed(2)}</strong>
        </Typography>
        <RadioGroup value={paymentMethod} onChange={handlePaymentMethodChange} sx={{ marginTop: 2 }}>
          <FormControlLabel value="Cash on Delivery" control={<Radio />} label="Cash on Delivery" />
          <FormControlLabel value="Card Payment" control={<Radio />} label="Card Payment" />
        </RadioGroup>
        {paymentMethod === 'Card Payment' && (
          <div style={{ marginTop: 16 }}>
            <TextField
              id="card-number"
              label="Card Number"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 16 }}
              placeholder="1234 5678 9012 3456"
            />
            <TextField
              label="Expiry Date (MM/YY)"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              fullWidth
              margin="normal"
              required
              placeholder="MM/YY"
            />
            <TextField
              label="CVV"
              type="password"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              fullWidth
              margin="normal"
              required
              inputProps={{ maxLength: 4 }}
              placeholder="123"
            />
          </div>
        )}
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button onClick={onClose} color="secondary" disabled={isProcessing}>
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          color="primary"
          variant="contained"
          disabled={!isCardPaymentValid || isProcessing}
          sx={{
            backgroundColor: isCardPaymentValid ? '#3f51b5' : '#ddd',
            ':hover': { backgroundColor: isCardPaymentValid ? '#303f9f' : '#ccc' },
          }}
        >
          {isProcessing ? <CircularProgress size={24} /> : paymentMethod === 'Card Payment' ? 'Pay Now' : 'Confirm Order'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentDialog;
