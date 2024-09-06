import { useState, useEffect } from 'react';
import { fetchReservationReport, fetchQueryReport, fetchUserActivityReport } from '@/services/api';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const useReportController = () => {
  const [reservationData, setReservationData] = useState<any[]>([]);
  const [queryData, setQueryData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const reservationResponse = await fetchReservationReport();
        const queryResponse = await fetchQueryReport();
        const userResponse = await fetchUserActivityReport();

        setReservationData(reservationResponse.reservations);
        setQueryData(queryResponse.queries);
        setUserData(userResponse.users);
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

    const reservationsSheet = XLSX.utils.json_to_sheet(reservationData);
    XLSX.utils.book_append_sheet(wb, reservationsSheet, 'Reservations');

    const queriesSheet = XLSX.utils.json_to_sheet(queryData);
    XLSX.utils.book_append_sheet(wb, queriesSheet, 'Queries');

    const usersSheet = XLSX.utils.json_to_sheet(userData);
    XLSX.utils.book_append_sheet(wb, usersSheet, 'Users');

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

  return { reservationData, queryData, userData, loading, exportToExcel };
};
