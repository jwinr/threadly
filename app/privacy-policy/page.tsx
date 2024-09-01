'use client'

import styled from 'styled-components'
import Link from 'next/link'

const PrivacyPageWrapper = styled.div`
  display: flex;
  padding: 80px;
  flex-direction: column;
  gap: 15px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 1px;
    background: repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 4px,
      var(--sc-color-divider) 4px,
      var(--sc-color-divider) 8px
    );
    opacity: 0.75;
  }

  &::before {
    left: 0px;
  }

  &::after {
    right: 0px;
  }

  p {
    font-size: 18px;
    margin: 24px 0;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }

  @media (max-width: 768px) {
    padding: 40px;
    max-width: 100%;
    padding: 30px;
  }
`

const HeaderText = styled.h1`
  font-weight: 700;
  font-size: 56px;
  color: var(--sc-color-title);

  @media (max-width: 768px) {
    font-size: 42px;
  }
`

const SubheaderText = styled.h2`
  font-weight: 600;
  font-size: 24px;
  color: var(--sc-color-title);

  @media (max-width: 768px) {
    font-size: 18px;
  }
`

const ListWrapper = styled.ul`
  padding-left: 40px;
  list-style: none;

  li {
    position: relative;
    margin: 5px 0;
    font-size: 18px;

    @media (max-width: 768px) {
      font-size: 15px;
    }
  }

  li::before {
    position: absolute;
    top: 11px;
    left: -23px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: var(--sc-color-bullet);
    content: '';

    @media (max-width: 768px) {
      top: 9px;
      left: -21px;
      width: 7px;
      height: 7px;
    }
  }
`

const PrivacyPolicy = () => {
  const emailString = process.env.NEXT_PUBLIC_CONTACT_EMAIL || ''

  return (
    <>
      <PrivacyPageWrapper role="main">
        <HeaderText>Privacy Policy</HeaderText>
        <section>
          <p>
            At Threadly, we take your privacy seriously. Please read this Privacy Policy to learn
            how we treat your personal data. By using or accessing our Sites and Services in any
            manner, you accept the practices and policies outlined in this Privacy Notice and you
            acknowledge that we may process and share your information.
          </p>
        </section>
        <section>
          <SubheaderText>Information We Collect</SubheaderText>
          <p>
            <b>Personal Data</b>
          </p>
          <p>
            While using our Service, we may ask you to provide us with certain personally
            identifiable information that can be used to contact or identify you (“Personal Data”).
            Personally identifiable information may include, but is not limited to:
          </p>
          <ListWrapper role="list">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Cookies and Usage Data</li>
          </ListWrapper>
          <p>
            <b>Usage Data</b>
          </p>
          <p>
            We may also collect information that your browser sends whenever you visit our Service
            or when you access Service by or through a mobile device (“Usage Data”). This Usage Data
            may include information such as your computer's Internet Protocol address (e.g. IP
            address), browser type, browser version, the pages of our Service that you visit, the
            time and date of your visit, the time spent on those pages, unique device identifiers
            and other diagnostic data. When you access Service with a mobile device, this Usage Data
            may include information such as the type of mobile device you use, your mobile device
            unique ID, the IP address of your mobile device, your mobile operating system, the type
            of mobile Internet browser you use, unique device identifiers and other diagnostic data.
          </p>
          <p>
            <b>Tracking Cookies Data</b>
          </p>
          <p>
            We use cookies and similar tracking technologies to track the activity on our Service
            and we hold certain information. Cookies are files with a small amount of data which may
            include an anonymous unique identifier. Cookies are sent to your browser from a website
            and stored on your device. Other tracking technologies are also used such as beacons,
            tags and scripts to collect and track information and to improve and analyze our
            Service. You can instruct your browser to refuse all cookies or to indicate when a
            cookie is being sent. However, if you do not accept cookies, you may not be able to use
            some portions of our Service.
          </p>
          <p>
            <b>Examples of Cookies we use:</b>
          </p>
          <p>
            We use cookies and similar tracking technologies to track the activity on our Service
            and we hold certain information.
          </p>
          <ListWrapper role="list">
            <li>
              <b>Session Cookies</b>: We use Session Cookies to operate our Service.
            </li>
            <li>
              <b>Preference Cookies</b>: We use Preference Cookies to remember your preferences and
              various settings.
            </li>
            <li>
              <b>Security Cookies</b>: We use Security Cookies for security purposes.
            </li>
          </ListWrapper>
        </section>
        <section>
          <SubheaderText>How We Use Information</SubheaderText>
          <p>We use the collected data for various purposes:</p>
          <ListWrapper role="list">
            <li>To provide and maintain our Service;</li>
            <li>To notify you about changes to our Service;</li>
            <li>
              To allow you to participate in interactive features of our Service when you choose to
              do so;
            </li>
            <li>To provide customer support;</li>
            <li>To gather analysis or valuable information so that we can improve our Service;</li>
            <li>To monitor the usage of our Service;</li>
            <li>To detect, prevent and address technical issues;</li>
            <li>To fulfill any other purpose for which you provide it;</li>
            <li>
              To carry out our obligations and enforce our rights arising from any contracts entered
              into between you and us;
            </li>
            <li>To provide you with notices about your account;</li>
            <li>In any other way we may describe when you provide the information;</li>
            <li>For any other purpose with your consent.</li>
          </ListWrapper>
        </section>
        <section>
          <SubheaderText>Security and Retention</SubheaderText>
          <p>
            We make reasonable efforts to provide a level of security appropriate to the risk
            associated with the processing of your Personal Data. Please remember that no method of
            transmission over the Internet or method of electronic storage is 100% secure.
          </p>
          <p>
            We will retain your Personal Data only for as long as is necessary for the purposes set
            out in this Privacy Policy. We will retain and use your Personal Data to the extent
            necessary to comply with our legal obligations (for example, if we are required to
            retain your data to comply with applicable laws), resolve disputes, and enforce our
            legal agreements and policies.
          </p>
          <p>
            We will also retain Usage Data for internal analysis purposes. Usage Data is generally
            retained for a shorter period, except when this data is used to strengthen the security
            or to improve the functionality of our Service, or we are legally obligated to retain
            this data for longer time periods.
          </p>
        </section>
        <section>
          <SubheaderText>Your Data Protection Rights</SubheaderText>
          <p>
            We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use
            of your Personal Data. If you wish to be informed what Personal Data we hold about you
            and if you want it to be removed from our systems, please contact us.
          </p>
          <p>In certain circumstances, you have the following data protection rights:</p>
          <ListWrapper role="list">
            <li>The right to access, update or to delete the information we have on you.</li>
            <li>
              The right of rectification. You have the right to have your information rectified if
              that information is inaccurate or incomplete.
            </li>
            <li>
              The right to object. You have the right to object to our processing of your Personal
              Data.
            </li>
            <li>
              The right of restriction. You have the right to request that we restrict the
              processing of your personal information.
            </li>
            <li>
              The right to data portability. You have the right to be provided with a copy of your
              Personal Data in a structured, machine-readable and commonly used format.
            </li>
            <li>
              The right to withdraw consent. You also have the right to withdraw your consent at any
              time where we rely on your consent to process your personal information.
            </li>
          </ListWrapper>
          <p>
            Please note that we may ask you to verify your identity before responding to such
            requests. Please note, we may not able to provide Service without some necessary data.
          </p>
        </section>
        <section>
          <SubheaderText>Service Providers</SubheaderText>
          <p>
            We use Stripe for payments, analytics, and other business services. Stripe may collect
            personal data including via cookies and similar technologies. The personal data Stripe
            collects may include transactional data and identifying information about devices that
            connect to its services. Stripe uses this information to operate and improve the
            services it provides to us, including for fraud detection, loss prevention,
            authentication, and analytics related to the performance of its services. You can learn
            more about Stripe and read its privacy policy at{' '}
            <b>
              <Link href="https://stripe.com/privacy">https://stripe.com/privacy</Link>
            </b>
            {'.'}
          </p>
          <p>
            We use Amazon Web Services (AWS), including Amazon Cognito, which collect personal
            information to operate, provide, and improve AWS offerings. This information includes
            data you provide directly, data collected automatically during interactions, and data
            from other sources. AWS uses this information for various purposes, such as processing
            transactions, personalizing your experience, preventing fraud, and complying with legal
            obligations. You can read more about how AWS uses your Personal Information at{' '}
            <b>
              <Link href="https://aws.amazon.com/privacy">https://aws.amazon.com/privacy</Link>
            </b>
            {'.'}
          </p>
          <p>
            We use Google Analytics to monitor and analyze the use of our Service. Google Analytics
            is a web analytics service offered by Google that tracks and reports website traffic.
            Google uses the data collected to track and monitor the use of our Service. This data is
            shared with other Google services. Google may use the collected data to contextualize
            and personalize the ads of its own advertising network. For more information on the
            privacy practices of Google, please visit{' '}
            <b>
              <Link href="https://policies.google.com/privacy">
                https://policies.google.com/privacy
              </Link>
            </b>
            {'.'}
          </p>
        </section>
        <section>
          <SubheaderText>Personal Data of Children</SubheaderText>
          <p>
            The Site and Services are not directed or intended for use by individuals under the age
            of 18. We do not knowingly collect personally identifiable information from anyone under
            the age of 18. If you are a parent or guardian and you are aware that your Child has
            provided us with Personal Data, please contact us. If we become aware that we have
            collected Personal Data from children without verification of parental consent, we take
            steps to remove that information from our servers.
          </p>
        </section>
        <section>
          <SubheaderText>Changes to This Privacy Policy</SubheaderText>
          <p>
            We may update this privacy policy from time to time in order to reflect, for example,
            changes to our practices or for other operational, legal or regulatory reasons.
          </p>
        </section>
        <section>
          <SubheaderText>Contact Us</SubheaderText>
          <p>
            For more information about our privacy practices, if you have questions, or if you would
            like to make a complaint, please contact us at <b>{emailString}</b>.
          </p>
        </section>
      </PrivacyPageWrapper>
    </>
  )
}

export default PrivacyPolicy
