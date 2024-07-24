import Head from "next/head"
import styled from "styled-components"

const ShipPolicyPageWrapper = styled.div`
  display: flex;
  padding: 30px 30px 30px 30px;
  flex-direction: column;
  gap: 15px;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`

const HeaderText = styled.h1`
  font-weight: 800;
  font-size: 29px;
`

const SubheaderText = styled.h2`
  font-weight: 700;
  font-size: 25px;
`

const ListWrapper = styled.ol`
  padding-left: 40px;
  list-style: disc;
`

const ShippingPolicy = () => {
  return (
    <>
      <Head>
        <title>Shipping Policy</title>
        <meta
          name="description"
          content="See the TechNexus shipping and delivery info on laptops, computers and other items."
        />
      </Head>
      <ShipPolicyPageWrapper>
        <HeaderText>Shipping Policy</HeaderText>
        <p>
          This website is for demonstration purposes and does not involve actual
          sales or shipping of products.
        </p>
        <SubheaderText>Order Confirmation</SubheaderText>
        <p>
          After placing an order, you will receive an Order Acknowledgement
          email to confirm your order details and provide a link to your order
          detail page. This email will include a summary of your order,
          estimated shipping dates, and other relevant information. Please note
          that no actual products will be shipped.
        </p>
        <SubheaderText>Shipping and Delivery Estimates</SubheaderText>
        <p>
          Shipping estimates are based on product availability and chosen
          shipping methods:
        </p>
        <ListWrapper role="list">
          <li>
            <b>In-Stock Items:</b> Orders for items in stock are estimated to
            ship the next business day. Delivery times depend on the destination
            and the selected shipping method.
          </li>
          <li>
            <b>Backorder or Pre-Order Items:</b> For items on backorder or
            pre-order, estimated shipping and delivery dates will be indicated
            on the product page, in the cart, and at checkout.
          </li>
          <li>
            <b>Partial Shipments:</b> If you request to ship available items in
            advance of backordered items, additional shipping fees may apply.
            Contact customer support at help@jwtechnexus.com to arrange partial
            shipments.
          </li>
        </ListWrapper>
        <p>
          Delivery timeframes are estimates and based on business days. Actual
          delivery times may vary due to carrier operations and other factors.
        </p>
        <SubheaderText>Shipping Days</SubheaderText>
        <p>Our simulated shipping days are:</p>
        <ListWrapper role="list">
          <li>Monday</li>
          <li>Tuesday</li>
          <li>Wednesday</li>
          <li>Thursday</li>
          <li>Friday</li>
        </ListWrapper>
        <p>
          Orders are processed on business days only. High demand or peak
          periods may extend handling times.
        </p>
        <SubheaderText>Free Shipping Eligibility</SubheaderText>
        <p>
          Free shipping offers on cart values above a certain threshold apply to
          orders simulated as fulfilled and shipped by TechNexus. Free shipping
          covers standard shipping fees and does not include handling or tax
          charges where applicable. These offers are for demonstration and are
          subject to change without notice.
        </p>
        <SubheaderText>Undelivered Packages</SubheaderText>
        <p>
          If a carrier returns an undelivered package to us, we will contact you
          to resolve any issues and confirm a new shipment. If this occurs, a
          simulated full refund, including shipping charges, will be issued. For
          undelivered packages due to the receiver's fault or a second return, a
          refund excluding shipping charges will be issued.
        </p>
        <p>
          Please ensure your address information is accurate before confirming
          your order and notify the receiving party to prevent undelivered
          packages.
        </p>
        <HeaderText>Shipping FAQs</HeaderText>
        <SubheaderText>How do I track my order?</SubheaderText>
        <p>
          Once your order ships, you will receive a Shipment Confirmation email
          with a tracking number. You can use this number to track your package
          on the carrier's website.
        </p>
        <SubheaderText>
          Can I change my shipping address after placing an order?
        </SubheaderText>
        <p>
          If you need to change your shipping address, please contact customer
          support at help@jwtechnexus.com as soon as possible. Changes can only
          be made before the order has shipped.
        </p>
        <SubheaderText>What shipping methods are available?</SubheaderText>
        <p>
          We offer various shipping methods, including standard, expedited, and
          overnight shipping. The availability of these options depends on your
          location and the items in your order.
        </p>
        <SubheaderText>Why is my order delayed?</SubheaderText>
        <p>
          Delays can occur due to various reasons, including high demand
          periods, carrier issues, or inclement weather. We strive to provide
          accurate estimates but cannot guarantee delivery times.
        </p>
        <SubheaderText>Do you ship internationally?</SubheaderText>
        <p>We only ship within the United States.</p>
      </ShipPolicyPageWrapper>
    </>
  )
}

export default ShippingPolicy
