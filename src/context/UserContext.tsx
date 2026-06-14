'use client';

import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
  useMemo,
} from 'react';
import {INVALID_JWT_TOKEN_ERROR} from '@/lib/constants';
import {fetchStripeCustomerId} from '@/utils/fetchStripeCustomerId';

interface UserAttributes {
  sub?: string;
  email?: string;
  family_name?: string;
  given_name?: string;
  user_uuid?: string;
  stripe_customer_id?: string;
  created_at?: string;
}

interface UserContextType {
  userAttributes: UserAttributes | null;
  fetchUserAttributes: () => Promise<void>;
  fetchPaymentMethods: (userUuid: string) => Promise<unknown[]>;
  getToken: () => Promise<object | null>;
  loading: boolean;
}

const defaultUserContext: UserContextType = {
  userAttributes: null,
  fetchUserAttributes: async () => {},
  // eslint-disable-next-line @typescript-eslint/require-await
  fetchPaymentMethods: async () => [],
  // eslint-disable-next-line @typescript-eslint/require-await
  getToken: async () => null,
  loading: true,
};

export const UserContext = createContext<UserContextType>(defaultUserContext);

interface UserProviderProps {
  children: ReactNode;
  initialUserAttributes: UserAttributes | null;
}

export const UserProvider: React.FC<UserProviderProps> = ({
  children,
  initialUserAttributes,
}) => {
  const [userAttributes, setUserAttributes] = useState<UserAttributes | null>(
    initialUserAttributes
  );
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUserAttributes = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = (await response.json()) as {
          userAttributes: UserAttributes | null;
        };
        setUserAttributes(data.userAttributes);
      } else {
        setUserAttributes(null);
      }
    } catch (error) {
      console.error('Error fetching user session:', error);
      setUserAttributes(null);
    } finally {
      setAuthChecked(true);
      setLoading(false);
    }
  }, []);

  const getToken = async (): Promise<object | null> => {
    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(INVALID_JWT_TOKEN_ERROR);
      }

      return {authenticated: true};
    } catch (error) {
      console.error('Error fetching auth session:', error);
      return null;
    }
  };

  useEffect(() => {
    // Only fetch user attributes if auth hasn't been checked yet
    if (!authChecked) {
      // If initialUserAttributes are present and complete, set authChecked to true
      const hasCompleteAttributes =
        initialUserAttributes && initialUserAttributes.user_uuid;

      if (hasCompleteAttributes) {
        setAuthChecked(true);
        setLoading(false);
      } else {
        // Fetch user attributes since initial data is missing or incomplete
        void fetchUserAttributes();
      }
    }
  }, [authChecked, fetchUserAttributes, initialUserAttributes]);

  const fetchPaymentMethods = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      return [];
    }

    try {
      const stripeCustomerId = await fetchStripeCustomerId({
        Authorization: `Bearer ${JSON.stringify(token)}`,
        'Content-Type': 'application/json',
      });
      if (!stripeCustomerId) {
        return [];
      }

      // Now fetch the payment methods using the Stripe customer ID
      const paymentResponse = await fetch(
        `/api/account/payments?stripe_customer_id=${stripeCustomerId}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${JSON.stringify(token)}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const paymentData: {paymentMethods: unknown[]; error?: string} =
        (await paymentResponse.json()) as {
          paymentMethods: unknown[];
          error?: string;
        };

      if (paymentResponse.ok) {
        return paymentData.paymentMethods;
      } else {
        console.error(
          'Failed to fetch payment methods:',
          paymentData?.error || 'Unknown error'
        );
        return [];
      }
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }, [getToken]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      userAttributes,
      fetchUserAttributes,
      fetchPaymentMethods,
      getToken,
      loading,
    }),
    [
      userAttributes,
      fetchUserAttributes,
      fetchPaymentMethods,
      getToken,
      loading,
    ]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
