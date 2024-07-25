import Head from "next/head"
import styled from "styled-components"

const PrivacyPageWrapper = styled.div`
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
  font-weight: 800;
  font-size: 16px;
`

const ListWrapper = styled.ol`
  padding-left: 40px;
  list-style: disc;
`

const UnbulletedItem = styled.li`
  margin: 5px 0;
  list-style: none;
`

const PrivacyPolicy = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy</title>
        <meta
          name="description"
          content="Your privacy is important to us. This page discloses the privacy policy of Nexari. We are concerned about your privacy and the security of your important personal information. We want you to be aware of what kind of information we obtain from you, how we use this information, and how you can control its use."
        />
      </Head>
      <PrivacyPageWrapper>
        <HeaderText>Privacy Policy</HeaderText>
        <p>
          Nexari provides its services globally and the Nexari entity
          responsible for the collection and use of Personal Information under
          this Privacy Policy differs depending on the service. All entities
          fall under Nexari (“Nexari”, “we”, “our” or “us”).
        </p>
        <p>
          {" "}
          This Privacy Policy describes how your personal information is
          collected, used, and shared when you visit our website (<b>“Site”</b>
          ), or make an account with Nexari.
        </p>
        <p>
          {" "}
          This policy applies to Nexari’s own Services. Websites, products and
          services of third-parties and some affiliates of Nexari are subject to
          their own separate privacy policies.
        </p>
        <SubheaderText>PERSONAL INFORMATION WE COLLECT</SubheaderText>
        <p>
          When you visit the Site, we automatically collect certain information
          about your device, including information about your web browser, IP
          address, time zone, and some of the cookies that are installed on your
          device. Additionally, as you browse the Site, we collect information
          about the individual web pages or products that you view, and
          information about how you interact with the Site. We refer to this
          automatically-collected information as <b>“Device Information”</b>.
        </p>
        <p> We collect Device Information using the following technologies:</p>
        <ListWrapper role="list">
          <li>
            “Cookies” are data files that are placed on your device or computer
            and often include an anonymous unique identifier. For more
            information about cookies, and how to disable cookies, visit{" "}
            <b>
              <a href="https://www.allaboutcookies.org">
                https://www.allaboutcookies.org
              </a>
            </b>
            .
          </li>
          <li>
            “Log files” track actions occurring on the Site, and collect data
            including your IP address, browser type, Internet service provider,
            referring/exit pages, and date/time stamps.
          </li>
          <li>
            “Web beacons”, “tags”, and “pixels” are electronic files used to
            record information about how you browse the Site.
          </li>
        </ListWrapper>
        <p>
          Additionally we do not facilitate real purchases or collect payment
          information. Any references to purchases or payment information on the
          website are for demonstration purposes only. No actual transactions or
          payment processing occur on this website. We refer to this information
          as <b>“Order Information”</b>.
        </p>
        <p>
          When we talk about <b>“Personal Information”</b> in this Privacy
          Policy, we are talking both about Device Information and Order
          Information.
        </p>
        <SubheaderText>HOW DO WE USE YOUR PERSONAL INFORMATION?</SubheaderText>
        <p>
          We use the Order Information that we collect generally for
          demonstration purposes only. While you may interact with features that
          simulate order placement, including providing information such as
          name, address, and payment details, please note that no actual orders
          are processed, and no payment information is collected or stored by
          our website. The Order Information provided by you is used solely for
          demonstration purposes, such as showcasing website functionality or
          conducting tests, and is not retained or used for any other purpose.
        </p>
        <p>
          We use the Device Information that we collect to help us screen for
          potential risk and malicious activity (in particular, your IP
          address), and more generally to improve and optimize our Site (for
          example, by generating analytics about how our users browse and
          interact with the Site).
        </p>
        <SubheaderText>SHARING YOUR PERSONAL INFORMATION</SubheaderText>
        <p>
          We share your Personal Information with third parties to help us use
          your Personal Information, as described above. The following third
          parties are involved:
        </p>
        <ListWrapper role="list">
          <li>
            <b>We use Stripe for our payment processing</b>
          </li>
          <UnbulletedItem>
            You can read more about how Stripe uses your Personal Information
            here:{" "}
            <b>
              <a href="https://stripe.com/en-nl/privacy">
                https://stripe.com/en-nl/privacy
              </a>
            </b>
          </UnbulletedItem>
          <li>
            <b>We also use PayPal for our payment processing</b>
          </li>
          <UnbulletedItem>
            You can read more about how PayPal uses your Personal Information
            here:{" "}
            <b>
              <a href="https://www.paypal.com/us/legalhub/privacy-full">
                https://www.paypal.com/us/legalhub/privacy-full
              </a>
            </b>
          </UnbulletedItem>
          <li>
            <b>We use Amazon Cognito for login authentication</b>
          </li>
          <UnbulletedItem>
            You can read more about how Amazon Cognito uses your Personal
            Information here:{" "}
            <b>
              <a href="https://aws.amazon.com/privacy">
                https://aws.amazon.com/privacy
              </a>
            </b>
          </UnbulletedItem>
        </ListWrapper>
        <p>
          We may also share your Personal Information to comply with applicable
          laws and regulations, to respond to a subpoena, search warrant or
          other lawful request for information we receive, or to otherwise
          protect our rights.
        </p>
        <SubheaderText>DO NOT TRACK</SubheaderText>
        <p>
          Please note that we do not alter our Site’s data collection and use
          practices when we see a Do Not Track signal from your browser.
        </p>
        <SubheaderText>YOUR RIGHTS AND CHOICES</SubheaderText>
        <menu>
          <li>How you can see or change your account Personal Information</li>
        </menu>
        <p>
          If you would like to review, correct, or update Personal Information
          that you have previously disclosed to us, you may do so by signing in
          to your Nexari account or by contacting us through the contact
          information under contact us.
        </p>
        <menu>
          <li>Your data protection rights</li>
        </menu>
        <p>
          Depending on your location and subject to applicable law, you may have
          the following rights with regard to the Personal Information we
          control about you:
        </p>
        <ListWrapper role="list">
          <li>
            The right to request confirmation of whether Nexari processes
            Personal Information relating to you, and if so, to request a copy
            of that Personal Information.
          </li>
          <li>
            The right to request that Nexari rectifies or updates your Personal
            Information that is inaccurate, incomplete or outdated.
          </li>
          <li>
            The right to request that Nexari erase your Personal Information in
            certain circumstances provided by law.
          </li>
          <li>
            The right to request that Nexari restrict the use of your Personal
            Information.
          </li>
          <li>
            The right to request that we export your Personal Information that
            we hold to another company, where technically feasible.
          </li>
          <li>
            Where the processing of your Personal Information is based on your
            previously given consent, you have the right to withdraw your
            consent at any time; and/or
          </li>
          <li>
            In some cases, you may also have the right to object to the
            processing of your Personal Information.
          </li>
        </ListWrapper>
        <menu>
          <li>Subject access requests</li>
        </menu>
        <p>
          You can access your personal information through your Nexari account.
          When a manual request is made through contacting us, we will comply
          within 1 month at no cost.
        </p>
        <SubheaderText>DATA RETENTION AND TRANSFER</SubheaderText>
        <p>
          When you place an order through the Site, we will maintain your Order
          Information for our records unless and until you ask us to delete this
          information.
        </p>
        <p>
          Your Personal Information and Personal Data may be stored and
          processed within the United States depending on which services are
          used as listed above.
        </p>
        <SubheaderText>CHANGES</SubheaderText>
        <p>
          We may update this privacy policy from time to time in order to
          reflect, for example, changes to our practices or for other
          operational, legal or regulatory reasons.
        </p>
        <SubheaderText>CONTACT US</SubheaderText>
        <p>
          For more information about our privacy practices, if you have
          questions, or if you would like to make a complaint, please contact us
          by e‑mail at help@shopnexari.com
        </p>
      </PrivacyPageWrapper>
    </>
  )
}

export default PrivacyPolicy
