import { useMutation } from '@tanstack/react-query';
import { createDonation } from '@/src/api/donations';
import { CreateDonationRequest, Donation } from '@/src/api/types';

interface DonationMutationParams {
  request: CreateDonationRequest;
  token: string;
}

export const useDonation = () => {
  return useMutation<Donation, Error, DonationMutationParams>({
    mutationFn: ({ request, token }) => createDonation(request, token),
  });
};
