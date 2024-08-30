"use client"

import React, { useEffect, useState, useContext } from "react"
import styled from "styled-components"
import { UserContext } from "@/context/UserContext"
import LoaderDots from "@/components/Loaders/LoaderDots"
import useCurrencyFormatter from "@/hooks/useCurrencyFormatter"

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

const Orders = () => {
  const { userAttributes } = useContext(UserContext)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const formatCurrency = useCurrencyFormatter()

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (userAttributes && userAttributes.sub) {
          const apiKey = process.env.NEXT_PUBLIC_API_KEY
          if (!apiKey) {
            throw new Error("API key is missing")
          }
          const response = await fetch(
            `/api/orders?cognitoSub=${userAttributes.sub}`,
            {
              headers: {
                "x-api-key": apiKey,
              },
            }
          )
          const data = await response.json()
          setOrders(data)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userAttributes])

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
              {order.shipping_status === "Order Received" ? (
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
