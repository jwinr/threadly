'use client'

import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '@/context/UserContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styled from 'styled-components'
import Image from 'next/image'
import LoaderDots from '@/components/Loaders/LoaderDots'
import Profile from '@/public/images/icons/Profile.svg'
import Favorites from '@/public/images/icons/Favorites.svg'
import CreditCard from '@/public/images/icons/DefaultPayment.svg'
import HomeAddress from '@/public/images/icons/HomeAddress.svg'
import Purchases from '@/public/images/icons/Purchases.svg'
import useCheckLoggedInUser from 'src/hooks/useCheckLoggedInUser'
import useCurrencyFormatter from 'src/hooks/useCurrencyFormatter'
import { OrderDetail } from '@/types/order'

const AccountContainer = styled.div`
  margin: 0 auto;
  padding: 20px;
  gap: 20px;
  display: flex;
  flex-direction: column;
`

const Header = styled.h1`
  font-size: 29px;
  font-weight: bold;
  color: var(--sc-color-title);
  margin-bottom: 8px;
`

const CardFlexContainer = styled.div`
  display: flex;
  gap: 20px;
`

const ProfileContainer = styled.div`
  flex-basis: 33%;
  max-width: 33%;
  border-radius: 8px;
  padding: 20px;
  box-shadow:
    rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px,
    rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;

  svg {
    width: 48px;
    height: 48px;
  }
`

const OrderContainer = styled.div`
  flex-basis: 66%;
  max-width: 66%;
  border-radius: 8px;
  padding: 20px;
  box-shadow:
    rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px,
    rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;

  svg {
    width: 48px;
    height: 48px;
  }
`

const PaymentContainer = styled.div`
  flex-basis: 66%;
  max-width: 66%;
  border-radius: 8px;
  padding: 20px;
  box-shadow:
    rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px,
    rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;

  svg {
    width: 48px;
    height: 48px;
  }
`

const FavoriteContainer = styled.div`
  flex-basis: 66%;
  max-width: 66%;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow:
    rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px,
    rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;

  svg {
    width: 48px;
    height: 48px;
  }
`

const AddressesContainer = styled.div`
  flex-basis: 66%;
  max-width: 66%;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow:
    rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px,
    rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;

  svg {
    height: 48px;
  }
`

const SignInSecurityContainer = styled.div`
  flex-basis: 66%;
  max-width: 66%;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow:
    rgba(0, 0, 0, 0.04) 0px 6px 12px 4px,
    rgba(0, 0, 0, 0.04) 0px 4px 10px 2px,
    rgba(0, 0, 0, 0.06) 0px 2px 8px,
    rgba(0, 0, 0, 0.04) 0px 2px 4px;

  svg {
    width: 48px;
  }
`

const CardWrapper = styled.div`
  display: flex;
  gap: 10px;
`

const CardButton = styled.button`
  border: none;
  background: none;
  cursor: pointer;
  display: flex;
  align-items: center;
`

const Title = styled.div`
  font-weight: bold;
  font-size: 19px;
  text-align: left;
  color: var(--sc-color-title);
`

const ViewOrders = styled.a`
  margin-left: auto;
`

const InfoItem = styled.div`
  font-size: 16px;
`

const OrderListContainer = styled.div`
  margin-top: 20px;
`

const OrderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`

const OrderListItem = styled.li`
  display: flex;
  flex-wrap: nowrap;
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: var(--sc-color-white);
  border-radius: 8px;
  border: 1px solid var(--sc-color-gray-100);
  padding: 24px 48px 24px 48px;
`

const ImageWrapper = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 0 0 auto;
  width: 80px;
  height: 80px;
  order: 0;

  img {
    height: 80px;
    width: 80px;
    object-fit: scale-down;
  }
`

const LoadMoreButton = styled.button`
  display: block;
  margin: 20px auto;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
`

const TextWrapper = styled.div`
  text-align: start;
`

const Account: React.FC = () => {
  const { userAttributes } = useContext(UserContext) as {
    userAttributes?: {
      sub: string
      given_name: string
      family_name: string
      email: string
    }
  }
  const checkingUser = useCheckLoggedInUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [orders, setOrders] = useState<OrderDetail[]>([])
  const formatCurrency = useCurrencyFormatter()
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [offset, setOffset] = useState(0)
  const limit = 2

  const fetchOrders = async (offset = 0) => {
    try {
      const response = await fetch(
        `/api/orders?id=${userAttributes?.sub}&limit=${limit}&offset=${offset}`
      )
      const data = (await response.json()) as OrderDetail[]
      if (data.length < limit) {
        setHasMore(false)
      }
      setOrders((prevOrders) => [...prevOrders, ...data])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    if (!checkingUser && userAttributes) {
      void fetchOrders()
    }
  }, [checkingUser, userAttributes])

  const handleLoadMore = () => {
    setLoadingMore(true)
    setOffset((prevOffset) => prevOffset + limit)
    void fetchOrders(offset + limit)
  }

  const handleFavorites = () => {
    router.push('/favorites')
  }

  const handleAddPaymentMethod = () => {
    router.push('account/payments')
  }

  return (
    <>
      <AccountContainer>
        {loading ? (
          <LoaderDots />
        ) : (
          <>
            <Header>Account</Header>
            <CardFlexContainer>
              <ProfileContainer>
                <CardButton onClick={handleFavorites} type="button">
                  <CardWrapper>
                    <Profile />
                    <TextWrapper>
                      <Title>Profile</Title>
                      {userAttributes && (
                        <>
                          <InfoItem>
                            <span>
                              Name: {userAttributes.given_name}{' '}
                              {userAttributes.family_name}
                            </span>
                          </InfoItem>
                          <InfoItem>
                            <span>Email:</span> {userAttributes.email}
                          </InfoItem>
                        </>
                      )}
                    </TextWrapper>
                  </CardWrapper>
                </CardButton>
              </ProfileContainer>
              <OrderContainer>
                <CardWrapper>
                  <Purchases />
                  <Title>Orders</Title>
                  <ViewOrders>View all orders</ViewOrders>
                </CardWrapper>
                {orders.length === 0 ? (
                  <span>You don&apos;t have any recent orders to display.</span>
                ) : (
                  <OrderListContainer>
                    <OrderList>
                      {orders.map((order) => (
                        <OrderListItem key={order.order_detail_id}>
                          <ImageWrapper
                            href={`/orders/${order.order_detail_id}`}
                            aria-label={`View details of order #${order.order_detail_id}`}
                          >
                            {order.line_items &&
                              order.line_items.map((item) => (
                                <Image
                                  key={item.order_line_item_id}
                                  src={item.product_image_url ?? ''}
                                  alt={item.product_name ?? ''}
                                  width={80}
                                  height={80}
                                  priority={true}
                                />
                              ))}
                          </ImageWrapper>
                          <div>
                            <span>Order ID:</span>{' '}
                            <span>{order.order_detail_id}</span>
                          </div>
                          <div>
                            <span>Amount:</span>{' '}
                            {formatCurrency(order.amount_total || 0, true)}
                          </div>
                          <div>
                            <span>Order Date:</span>{' '}
                            {new Date(order.created_at).toLocaleString()}
                          </div>
                        </OrderListItem>
                      ))}
                    </OrderList>
                  </OrderListContainer>
                )}
                {hasMore && (
                  <LoadMoreButton
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
                  </LoadMoreButton>
                )}
              </OrderContainer>
            </CardFlexContainer>
            <CardFlexContainer>
              <PaymentContainer>
                <CardButton onClick={handleAddPaymentMethod} type="button">
                  <CardWrapper>
                    <CreditCard />
                    <div>
                      <Title>Payments</Title>
                      <InfoItem>
                        Add a payment card for quick online ordering.
                      </InfoItem>
                    </div>
                  </CardWrapper>
                </CardButton>
              </PaymentContainer>
              <FavoriteContainer>
                <CardButton onClick={handleFavorites} type="button">
                  <CardWrapper>
                    <Favorites />
                    <div>
                      <Title>Favorites</Title>
                      <InfoItem>View & add your favorited items.</InfoItem>
                    </div>
                  </CardWrapper>
                </CardButton>
              </FavoriteContainer>
            </CardFlexContainer>
            <CardFlexContainer>
              <AddressesContainer>
                <CardButton onClick={handleFavorites} type="button">
                  <CardWrapper>
                    <HomeAddress />
                    <div>
                      <Title>Addresses</Title>
                      <InfoItem>
                        Save an address to make it easier to order online.
                      </InfoItem>
                    </div>
                  </CardWrapper>
                </CardButton>
              </AddressesContainer>
              <SignInSecurityContainer>
                <CardButton onClick={handleFavorites} type="button">
                  <CardWrapper>
                    <div>
                      <Title>Settings</Title>
                      <InfoItem>Manage your name, email & password.</InfoItem>
                    </div>
                  </CardWrapper>
                </CardButton>
              </SignInSecurityContainer>
            </CardFlexContainer>
          </>
        )}
      </AccountContainer>
    </>
  )
}

export default Account
