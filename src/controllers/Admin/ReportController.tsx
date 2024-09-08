import { useState, useEffect } from 'react';
import { fetchReservationReport, fetchQueryReport, fetchUserActivityReport, fetchPaymentReport } from '@/services/api';
import { PaymentReportResponse } from '@/models/PaymentReport'; 
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const useReportController = () => {
  const [reservationData, setReservationData] = useState<any[]>([]);
  const [queryData, setQueryData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [paymentData, setPaymentData] = useState<any[]>([]); 
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const reservationResponse = await fetchReservationReport();
        const queryResponse = await fetchQueryReport();
        const userResponse = await fetchUserActivityReport();
        const paymentResponse: PaymentReportResponse = await fetchPaymentReport(); // Fetch payment report

        setReservationData(reservationResponse.reservations);
        setQueryData(queryResponse.queries);
        setUserData(userResponse.users);
        setPaymentData(paymentResponse.report.paidOrders); // Ensure the correct path to payment data
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();

    // Export Reservations
    const reservationsSheet = XLSX.utils.json_to_sheet(reservationData);
    XLSX.utils.book_append_sheet(wb, reservationsSheet, 'Reservations');

    // Export Queries
    const queriesSheet = XLSX.utils.json_to_sheet(queryData);
    XLSX.utils.book_append_sheet(wb, queriesSheet, 'Queries');

    // Export Users
    const usersSheet = XLSX.utils.json_to_sheet(userData);
    XLSX.utils.book_append_sheet(wb, usersSheet, 'Users');

    // Export Payment Report
    const paymentSheet = XLSX.utils.json_to_sheet(paymentData);
    XLSX.utils.book_append_sheet(wb, paymentSheet, 'PaymentReport');

    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

    const s2ab = (s: string) => {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
      }
      return buf;
    };

    saveAs(new Blob([s2ab(wbout)], { type: 'application/octet-stream' }), 'report.xlsx');
  };

  return { reservationData, queryData, userData, paymentData, loading, exportToExcel };
};
