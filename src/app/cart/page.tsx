'use client';

import React, {useContext, useEffect, useState} from 'react';
import styled from 'styled-components';
import {UserContext} from '@/context/UserContext';
import {CartContext, CartItem} from '@/context/CartContext';
import {useMobileView} from '@/context/MobileViewContext';
import Point from '@/public/images/icons/notdef.svg';
import useCurrencyFormatter from 'src/hooks/useCurrencyFormatter';
import ShippingInfo from '@/components/Shopping/ShippingInfo';
import OrderSummary from '@/components/Shopping/OrderSummary';
import {CartItems} from '@/components/Shopping/CartItems';
import FavoritesSection from '@/components/Shopping/FavoritesSection';
import EmptyCartSection from '@/components/Shopping/EmptyCartSection';
import EmptyFavoritesSection from '@/components/Shopping/EmptyFavoritesSection';
import {
  PageWrapper,
  MainContent,
  ContentWrapper,
  OrderSummaryWrapper,
  TitleWrapper,
  Header,
  CartContainer,
  CartWrapper,
  Subtitle,
} from '@/components/Shopping/CartStyles';
import OrderSpinner from '@/components/Loaders/OrderSpinner';
import {FavoriteItem} from '@/types/favorites';
import {listFavorites} from '@/utils/favoritesClient';

const StyledPoint = styled(Point)`
  width: 24px;
  height: 24px;
`;

interface PreviousTotals {
  subtotal: string;
  estimatedTaxes: string;
  total: string;
  totalQuantity: number;
}

const Cart: React.FC = () => {
  const {userAttributes} = useContext(UserContext);
  const {cart, removeFromCart, loadingSummary, handleQuantityChange, cartLoading} =
    useContext(CartContext) ?? {};
  const [favoritesLoading, setFavoritesLoading] = useState<boolean>(false);
  const [offset, setOffset] = useState(0);
  const isMobileView = useMobileView();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const {deliveryDate, zipCode} = ShippingInfo();
  const formatCurrency = useCurrencyFormatter();

  const [previousTotals, setPreviousTotals] = useState<PreviousTotals>({
    subtotal: '0.00',
    estimatedTaxes: '0.00',
    total: '0.00',
    totalQuantity: 0,
  });

  const fetchFavorites = async (newOffset = 0) => {
    if (!userAttributes || !userAttributes.user_uuid) {
      // For guests, ensure favorites are empty
      setFavorites([]);
      return;
    }

    try {
      setFavoritesLoading(true);
      const data = await listFavorites<FavoriteItem>({
        userId: userAttributes.user_uuid,
        limit: 5,
        offset: newOffset,
      });
      setFavorites((prevFavorites) => [...prevFavorites, ...data]);
      setOffset(newOffset + 5);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setFavoritesLoading(false);
    }
  };

  useEffect(() => {
    // Only call fetchFavorites if the user is signed in
    if (userAttributes?.user_uuid) {
      fetchFavorites();
    }
  }, [userAttributes]);

  const calculateTotal = (cart: CartItem[]) => {
    const subtotal = cart.reduce((sum, item) => {
      const price = Number(item.product_sale_price || item.product_price);
      const quantity = Number(item.quantity);
      return sum + price * quantity;
    }, 0);

    const estimatedTaxes = subtotal * 0.07;
    const total = subtotal + estimatedTaxes;

    const totalQuantity = cart.reduce(
      (sum, item) => sum + Number(item.quantity),
      0
    );

    return {
      subtotal: formatCurrency(subtotal),
      estimatedTaxes: formatCurrency(estimatedTaxes),
      total: formatCurrency(total),
      totalQuantity,
    };
  };

  useEffect(() => {
    if (!loadingSummary) {
      const totals = calculateTotal(cart || []);
      setPreviousTotals(totals);
    }
  }, [loadingSummary, cart]);

  const {subtotal, estimatedTaxes, total, totalQuantity} = previousTotals;
  const isLoading = cartLoading || favoritesLoading;

  return (
    <PageWrapper>
      <MainContent>
        <ContentWrapper>
          <CartWrapper>
            <TitleWrapper>
              <Header>Cart</Header>
            </TitleWrapper>
            <>
              <Subtitle $isLoading={isLoading}>
                {!isLoading && totalQuantity > 0 && (
                  <h1>
                    {subtotal} subtotal <StyledPoint /> {totalQuantity}{' '}
                    {totalQuantity === 1 ? 'item' : 'items'}
                  </h1>
                )}
              </Subtitle>
              <CartContainer $isLoading={isLoading}>
                {!isLoading && (
                  <>
                    {cart?.length ? (
                      <CartItems
                        cart={cart}
                        isMobileView={isMobileView}
                        deliveryDate={deliveryDate}
                        handleQuantityChange={handleQuantityChange}
                        removeFromCart={removeFromCart}
                      />
                    ) : (
                      <EmptyCartSection userAttributes={userAttributes} />
                    )}
                  </>
                )}
              </CartContainer>
              {isMobileView && (
                <OrderSummaryWrapper>
                  <OrderSummary
                    subtotal={subtotal}
                    estimatedTaxes={estimatedTaxes}
                    total={total}
                    totalQuantity={totalQuantity}
                    zipCode={zipCode}
                    $isLoading={isLoading}
                    loadingSummary={loadingSummary ?? false}
                  />
                </OrderSummaryWrapper>
              )}
            </>
            <CartContainer $isLoading={isLoading}>
              {!isLoading ? (
                favorites.length > 0 ? (
                  <FavoritesSection
                    favorites={favorites}
                    loadMoreFavorites={() => fetchFavorites(offset)}
                    isMobileView={isMobileView}
                  />
                ) : (
                  <EmptyFavoritesSection />
                )
              ) : null}
            </CartContainer>
          </CartWrapper>
        </ContentWrapper>
        {!isMobileView && (
          <OrderSummaryWrapper>
            <OrderSpinner $isLoading={loadingSummary ?? false} />
            <OrderSummary
              subtotal={subtotal}
              estimatedTaxes={estimatedTaxes}
              total={total}
              totalQuantity={totalQuantity}
              zipCode={zipCode}
              $isLoading={isLoading}
              loadingSummary={loadingSummary ?? false}
            />
          </OrderSummaryWrapper>
        )}
      </MainContent>
    </PageWrapper>
  );
};

export default Cart;
