import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminApi from '@/service/Api/AdminApi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export const useDevRequestDetails = (id: string | undefined) => {
  const navigate = useNavigate();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const queryClient = useQueryClient();

  const { data: developerData, isLoading, error, refetch } = useQuery({
    queryKey: ['developer-request', id],
    queryFn: () => AdminApi.getDeveloperRequestDetails(id as string),
    enabled: !!id
  });

  const approveMutation = useMutation({
    mutationFn: () => AdminApi.approveDeveloperRequest(id as string),
    onSuccess: () => {
      toast.success('Developer request approved successfully');
      refetch();
      navigate('/admin/developers/requests');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to approve request');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: () => AdminApi.rejectDeveloperRequest(id as string, rejectionReason),
    onSuccess: () => {
      toast.success('Developer request rejected');
      setIsRejectDialogOpen(false);
      refetch();
      navigate('/admin/developers/requests');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to reject request');
    }
  });

  const handleApprove = () => {
    approveMutation.mutate();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a reason for rejection');
      return;
    }
    rejectMutation.mutate();
  };

  return {
    developerData,
    isLoading,
    error,
    isRejectDialogOpen,
    setIsRejectDialogOpen,
    rejectionReason,
    setRejectionReason,
    handleApprove,
    handleReject,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending
  };
};