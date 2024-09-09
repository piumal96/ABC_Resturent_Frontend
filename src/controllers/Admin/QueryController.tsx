import { useState, useEffect } from 'react';
import { fetchQueries, deleteQuery,sendQueryReply } from '@/services/api'; // Adjust import paths accordingly

export interface Query {
  _id: string;
  customer: {
    _id: string;
    email: string | null;
  } | null;
  subject: string | null;
  message: string | null;
  status: 'Pending' | 'Resolved' | 'In Progress' | 'Closed';  
  createdAt: Date | null;
}

export const useQueryController = () => {
  const [filter, setFilter] = useState('');
  const [queries, setQueries] = useState<Query[]>([]);
  const [filteredQueries, setFilteredQueries] = useState<Query[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<Query | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [expandedQueryId, setExpandedQueryId] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [queryToDelete, setQueryToDelete] = useState<Query | null>(null);

  useEffect(() => {
    const loadQueries = async () => {
      try {
        const fetchedQueries = await fetchQueries();
        setQueries(fetchedQueries);
        setFilteredQueries(fetchedQueries);
      } catch (error) {
        console.error('Error fetching queries:', error);
      }
    };

    loadQueries();
  }, []);

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  const handleSearch = () => {
    const lowercasedFilter = filter.toLowerCase();
    const filteredData = queries.filter(query =>
      (query.subject?.toLowerCase().includes(lowercasedFilter) || '') ||
      (query.createdAt?.toLocaleDateString().includes(lowercasedFilter) || '')
    );
    setFilteredQueries(filteredData);
  };

  const handleRowClick = (queryId: string) => {
    setExpandedQueryId(prevId => (prevId === queryId ? null : queryId));
    setReplyMessage(''); // Clear reply message when opening a different row
  };

  

  const handleReplyChange = (message: string) => {
    setReplyMessage(message);
  };

  const handleSendReply = async () => {
    if (!expandedQueryId || !replyMessage.trim()) return; 

    try {
        await sendQueryReply(expandedQueryId, replyMessage); 
        alert('Reply sent successfully!');
        setExpandedQueryId(null); 
        setReplyMessage(''); 
    } catch (error) {
        console.error('Error sending reply:', error);
        alert('Failed to send reply. Please try again.');
    }
};

  const handleDeleteConfirmation = (query: Query) => {
    setQueryToDelete(query);
    setAnchorEl(null); // Close the menu
  };

  const handleConfirmDelete = async () => {
    if (queryToDelete) {
      try {
        await deleteQuery(queryToDelete._id);
        setQueries(prevQueries => prevQueries.filter(query => query._id !== queryToDelete._id));
        setFilteredQueries(prevFilteredQueries => prevFilteredQueries.filter(query => query._id !== queryToDelete._id));
        setQueryToDelete(null); // Reset the state
        alert('Query deleted successfully!');
      } catch (error) {
        console.error('Error deleting query:', error);
        alert('Failed to delete query. Please try again.');
      }
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, query: Query) => {
    setSelectedQuery(query);
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Resolved':
        return 'success';
      case 'In Progress':
        return 'info';
      default:
        return 'default';
    }
  };

  return {
    filter,
    filteredQueries,
    selectedQuery,
    replyMessage,
    expandedQueryId,
    anchorEl,
    queryToDelete,
    
    setQueryToDelete, // Only return this once
    handleFilterChange,
    handleSearch,
    handleRowClick,
    handleReplyChange,
    handleSendReply,
    handleDeleteConfirmation,
    handleConfirmDelete,
    handleMenuOpen,
    handleMenuClose,
    getStatusColor,
  };
};
