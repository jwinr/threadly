'use client'

import styled from 'styled-components'
import Link from 'next/link'

const TermsPageWrapper = styled.div`
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

const TermsService = () => {
  const emailString = process.env.NEXT_PUBLIC_CONTACT_EMAIL || ''

  return (
    <>
      <TermsPageWrapper role="main">
        <HeaderText>Terms of Service</HeaderText>
        <section>
          <p>Thank you for using Threadly!</p>
          <p>
            This website is independently operated by Threadly. Throughout the
            site, the terms “we,” “us,” and “our” refer to Threadly and/or its
            owner. This site is for demonstration purposes only and does not
            facilitate any real transactions or sales. It is not affiliated
            with, endorsed by, or connected to any recognized brands or
            companies. All trademarks and images are the property of their
            respective owners.
          </p>
          <p>
            By using this site, you agree to be bound by these Terms of Service.
            If you do not agree, you may not use the site.
          </p>
          <p>
            We may update or modify these Terms of Service from time to time.
            Any new features or changes to the site will be subject to the most
            current version of the Terms of Service. We encourage you to review
            this page periodically. Continued use of the site following any
            updates constitutes your acceptance of the new terms.
          </p>
        </section>
        <section>
          <SubheaderText>1. Website Usage Terms.</SubheaderText>
          <p>
            Service is intended only for access and use by individuals at least
            eighteen (18) years old. By accessing or using the Site, you warrant
            and represent that you are at least eighteen (18) years of age and
            with the full authority, right, and capacity to enter into this
            agreement and abide by all of the terms and conditions of Terms. If
            you are not at least eighteen (18) years old, you are prohibited
            from both the access and usage of Service.
          </p>
          <p>
            You may not use our Service for any illegal or unauthorized purpose
            nor may you, in the use of the Service, violate any laws in your
            jurisdiction (including but not limited to copyright laws).
          </p>
          <p>
            You must not transmit any worms or viruses or any code of a
            destructive nature. A breach or violation of any of the Terms will
            result in an immediate termination of your Services.
          </p>
        </section>
        <section>
          <SubheaderText>2. General Conditions.</SubheaderText>
          <p>
            We reserve the right to refuse service to anyone for any reason at
            any time.
          </p>
          <p>
            You understand that your content may be transferred unencrypted and
            involve (a) transmissions over various networks; and (b) changes to
            conform and adapt to technical requirements of connecting networks
            or devices.
          </p>
          <p>
            You agree not to reproduce, duplicate, copy, sell, resell or exploit
            any portion of the Service, use of the Service, or access to the
            Service or any contact on the website through which the service is
            provided, without express written permission by us.
          </p>
          <p>
            The headings used in this agreement are included for convenience
            only and will not limit or otherwise affect these Terms.
          </p>
        </section>
        <section>
          <SubheaderText>
            3. Accuracy, Completeness and Timeliness of Information.
          </SubheaderText>
          <p>
            The information on this site is for demonstration purposes only and
            may not be accurate, complete, or current. We reserve the right to
            modify the content at any time without obligation to update it.
          </p>
        </section>
        <section>
          <SubheaderText>
            4. Modifications to the Service and Pricing.
          </SubheaderText>
          <p>
            We reserve the right at any time to modify or discontinue the
            Service (or any part or content thereof) without notice at any time.
            We shall not be liable to you or to any third-party for any
            modification, price change, suspension or discontinuance of the
            Service.
          </p>
        </section>
        <section>
          <SubheaderText>5. Products or Services.</SubheaderText>
          <p>
            We may include descriptions or depictions of products or services
            for demonstrative purposes only. These products or services are not
            offered for sale, and no transactions or purchases can be made
            through the Service. While efforts are made to ensure the accuracy
            of the information provided, we do not guarantee the completeness or
            reliability of any products or services mentioned. All intellectual
            property rights associated with the products or services belong to
            their respective owners. The information provided should not be
            construed as professional advice, and we reserve the right to modify
            or remove any products or services at any time without notice.
          </p>
          <p>
            We do not warrant that the quality of any products, services,
            information, or other material purchased or obtained by you will
            meet your expectations, or that any errors in the Service will be
            corrected.
          </p>
        </section>
        <section>
          <SubheaderText>
            6. Accuracy of Billing and Account Information.
          </SubheaderText>
          <p>
            While our Service may include features that allow users to interact
            with payment processing services such as Stripe or PayPal, please
            note that these features are for demonstration purposes only. No
            actual transactions or payments can be processed through the
            Service.
          </p>
          <p>
            By using any payment processing features on this site, including the
            provision of demo card information, you acknowledge that any payment
            information you provide is solely for demonstration purposes and is
            used in Stripe’s test mode. These demo transactions are for
            illustrative purposes only and do not involve real transactions or
            require accurate billing details.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of any
            account information provided and for any activity that occurs under
            your account. We reserve the right to modify or remove any payment
            processing features at any time without notice.
          </p>
        </section>
        <section>
          <SubheaderText>7. Third-Party Links.</SubheaderText>
          <p>
            This site may include links to third-party websites or materials. We
            are not responsible for the content, accuracy, or any issues arising
            from the use of third-party websites or products.
          </p>
          <p>
            Any interactions with third-party sites are at your own risk. Please
            review their policies before engaging with them, as we are not
            liable for any related damages or issues.
          </p>
        </section>
        <section>
          <SubheaderText>8. User Comments and Feedback.</SubheaderText>
          <p>
            We value your feedback and are eager to hear your thoughts. Your
            input helps us enhance the site, and we appreciate the time you take
            to share it with us. While we may not be able to act on every
            suggestion, please know that all feedback is carefully considered.
          </p>
          <p>
            We may monitor, edit, or remove any product reviews that are
            unlawful, offensive, or violate rights. We assume no liability for
            reviews or comments posted by users.
          </p>
        </section>
        <section>
          <SubheaderText>9. Personal Information.</SubheaderText>
          <p>
            We may collect certain data from users to enhance the demo
            experience or analyze site usage. All data is collected and
            processed in accordance with our{' '}
            <Link href={`/privacy-policy`}>Privacy Policy</Link>, which outlines
            how we handle your personal information.
          </p>
        </section>
        <section>
          <SubheaderText>10. Errors and Inaccuracies.</SubheaderText>
          <p>
            The information on this site may contain errors, inaccuracies, or
            omissions. We reserve the right to correct any such issues and
            update the content at any time without prior notice.
          </p>
          <p>
            This site is for demonstration purposes only, and any information
            provided should not be relied upon for real transactions.
          </p>
        </section>
        <section>
          <SubheaderText>11. Prohibited Uses.</SubheaderText>
          <p>
            You are prohibited from using this site or its content for any
            unlawful purpose, to violate any laws, to infringe on intellectual
            property rights, to harass or discriminate against others, to submit
            false information, or to introduce harmful code. Additionally, you
            may not interfere with the site's security features or use the site
            to collect personal information without consent.
          </p>
          <p>
            We reserve the right to terminate your use of the site for violating
            these prohibitions.
          </p>
        </section>
        <section>
          <SubheaderText>
            12. Disclaimer of Warranties; Limitation of Liability.
          </SubheaderText>
          <p>
            This site is provided "as is" and "as available," without any
            warranties of any kind. We do not guarantee that your use of the
            site will be uninterrupted, secure, or error-free, and we make no
            warranties about the accuracy or reliability of the results.
          </p>
          <p>
            You use this site at your own risk. We are not liable for any
            damages, including lost profits, data loss, or other losses
            resulting from your use of the site.
          </p>
          <p>
            We reserve the right to modify or discontinue the site at any time
            without notice.
          </p>
        </section>
        <section>
          <SubheaderText>13. Indemnification.</SubheaderText>
          <p>
            You agree to indemnify and hold harmless Threadly and its owner from
            any claims, damages, or expenses, including reasonable attorneys'
            fees, arising from your breach of these Terms or your violation of
            any law or third-party rights.
          </p>
        </section>
        <section>
          <SubheaderText>14. Severability.</SubheaderText>
          <p>
            In the event that any provision of these Terms of Service is
            determined to be unlawful, void or unenforceable, such provision
            shall nonetheless be enforceable to the fullest extent permitted by
            applicable law, and the unenforceable portion shall be deemed to be
            severed from these Terms of Service, such determination shall not
            affect the validity and enforceability of any other remaining
            provisions.
          </p>
        </section>
        <section>
          <SubheaderText>15. Termination.</SubheaderText>
          <p>
            The obligations and liabilities of the parties incurred prior to the
            termination date shall survive the termination of this agreement for
            all purposes.
          </p>
          <p>
            These Terms of Service are effective unless and until terminated by
            either you or us. You may terminate these Terms of Service at any
            time by notifying us that you no longer wish to use our Services, or
            when you cease using our site.
          </p>
          <p>
            If in our sole judgment you fail, or we suspect that you have
            failed, to comply with any term or provision of these Terms of
            Service, we also may terminate this agreement at any time without
            notice and you will remain liable for all amounts due up to and
            including the date of termination; and/or accordingly may deny you
            access to our Services (or any part thereof).
          </p>
        </section>
        <section>
          <SubheaderText>16. Entire Agreement.</SubheaderText>
          <p>
            The failure of us to exercise or enforce any right or provision of
            these Terms of Service shall not constitute a waiver of such right
            or provision.
          </p>
          <p>
            These Terms of Service and any policies or operating rules posted by
            us on this site or in respect to The Service constitutes the entire
            agreement and understanding between you and us and govern your use
            of the Service, superseding any prior or contemporaneous agreements,
            communications and proposals, whether oral or written, between you
            and us (including, but not limited to, any prior versions of the
            Terms of Service).
          </p>
          <p>
            Any ambiguities in the interpretation of these Terms of Service
            shall not be construed against the drafting party.
          </p>
        </section>
        <section>
          <SubheaderText>17. Governing Law.</SubheaderText>
          <p>
            These Terms of Service and any separate agreements whereby we
            provide you Services shall be governed by and construed in
            accordance with the laws of the United States.
          </p>
        </section>
        <section>
          <SubheaderText>18. Changes to Terms of Service.</SubheaderText>
          <p>
            You can review the most current version of the Terms of Service at
            any time at this page.
          </p>
          <p>
            We reserve the right, at our sole discretion, to update, change or
            replace any part of these Terms of Service by posting updates and
            changes to our website. It is your responsibility to check our
            website periodically for changes. Your continued use of or access to
            our website or the Service following the posting of any changes to
            these Terms of Service constitutes acceptance of those changes.
          </p>
        </section>
        <section>
          <SubheaderText>19. Contact Information.</SubheaderText>
          <p>
            Questions about the Terms of Service should be sent to us at{' '}
            <b>{emailString}</b>
          </p>
        </section>
      </TermsPageWrapper>
    </>
  )
}

export default TermsService
