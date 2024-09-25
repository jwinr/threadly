'use client'

import React, { useEffect, useState, useContext } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/navigation'
import { UserContext } from '@/context/UserContext'
import LoaderDots from '@/components/Loaders/LoaderDots'
import useCurrencyFormatter from 'src/hooks/useCurrencyFormatter'

interface Order {
  order_id: string
  created_at: string
  amount_total: number
  shipping_status: string
  line_items: {
    order_line_item_id: string
    product_image_url: string
    product_name: string
  }[]
}

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`

const OrderContainer = styled.div`
  margin-bottom: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const OrderInfo = styled.div`
  flex: 1;
`

const OrderDate = styled.p`
  font-size: 14px;
  color: #666;
`

const OrderStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const StatusButton = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px 15px;
  margin: 5px 0;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`

const OrderItems = styled.div`
  display: flex;
  align-items: center;
`

const ItemImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
`

const Orders: React.FC = () => {
  const { userAttributes } = useContext(UserContext)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const formatCurrency = useCurrencyFormatter()
  const router = useRouter()

  useEffect(() => {
    if (!userAttributes?.sub) {
      // If the user is not signed in, redirect them to the login page
      router.replace('/login')
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `/api/orders?cognitoSub=${userAttributes.sub}`
        )
        const data: Order[] = (await response.json()) as Order[]
        setOrders(data)
      } catch (error) {
        console.error('Error fetching orders:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userAttributes, router])

  if (loading) {
    return <LoaderDots />
  }

  return (
    <Container>
      <h1>Order history</h1>
      {orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        orders.map((order) => (
          <OrderContainer key={order.order_id}>
            <OrderInfo>
              <OrderDate>
                Order Date: {new Date(order.created_at).toLocaleDateString()}
              </OrderDate>
              <p>{formatCurrency(order.amount_total)}</p>
              <p>Order #{order.order_id}</p>
            </OrderInfo>
            <OrderStatus>
              {order.shipping_status === 'Order Received' ? (
                <StatusButton>Track Package</StatusButton>
              ) : (
                <StatusButton disabled>Track Package</StatusButton>
              )}
              <StatusButton>Buy it Again</StatusButton>
            </OrderStatus>
            <OrderItems>
              {order.line_items.map((item) => (
                <ItemImage
                  key={item.order_line_item_id}
                  src={item.product_image_url}
                  alt={item.product_name}
                />
              ))}
            </OrderItems>
          </OrderContainer>
        ))
      )}
    </Container>
  )
}

export default Orders
