import Head from "next/head"
import styled from "styled-components"
import Link from "next/link"

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

const TermsService = () => {
  return (
    <>
      <Head>
        <title>Terms of Service</title>
        <meta
          name="description"
          content="See terms and conditions of using the TechNexus website. By using this web site, you agree to these terms of use."
        />
      </Head>
      <PrivacyPageWrapper>
        <HeaderText>Terms of Service</HeaderText>
        <p>OVERVIEW</p>
        <p>
          This website is operated by TechNexus. Throughout the site, the terms
          “we”, “us” and “our” refer to TechNexus. TechNexus offers this
          website, including all information and services available from this
          site to you, the user, conditioned upon your acceptance of all terms,
          conditions, policies, and notices stated here. This site is for
          demonstration purposes only and does not facilitate any real
          transactions or sales. It is not affiliated with, endorsed by, or
          connected to any of the brands or companies whose products are
          featured, including but not limited to Intel, Logitech, Nvidia, and
          others. All trademarks and product names are the property of their
          respective owners.
        </p>
        <p>
          By visiting our site and/or engaging with our demo services, you
          engage in our “Service” and agree to be bound by the following terms
          and conditions (“Terms of Service”, “Terms”), including those
          additional terms and conditions and policies referenced herein and/or
          available by hyperlink. These Terms of Service apply to all users of
          the site, including without limitation users who are browsers,
          vendors, customers, merchants, and/or contributors of content.
        </p>
        <p>
          Please read these Terms of Service carefully before accessing or using
          our website. By accessing or using any part of the site, you agree to
          be bound by these Terms of Service. If you do not agree to all the
          terms and conditions of this agreement, then you may not access the
          website or use any services. If these Terms of Service are considered
          an offer, acceptance is expressly limited to these Terms of Service.
        </p>
        <p>
          Any new features which are added to the current site shall also be
          subject to the Terms of Service. You can review the most current
          version of the Terms of Service at any time on this page. We reserve
          the right to update, change, or replace any part of these Terms of
          Service by posting updates and/or changes to our website. It is your
          responsibility to check this page periodically for changes. Your
          continued use of or access to the website following the posting of any
          changes constitutes acceptance of those changes.
        </p>
        <SubheaderText>SECTION 1 - WEBSITE USAGE TERMS</SubheaderText>
        <p>
          By agreeing to these Terms of Service, you represent that you are at
          least the age of majority in your state or province of residence, or
          that you are the age of majority in your state or province of
          residence and you have given us your consent to allow any of your
          minor dependents to use this site.
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
        <SubheaderText>SECTION 2 - GENERAL CONDITIONS</SubheaderText>
        <p>
          We reserve the right to refuse service to anyone for any reason at any
          time.
        </p>
        <p>
          You understand that your content may be transferred unencrypted and
          involve (a) transmissions over various networks; and (b) changes to
          conform and adapt to technical requirements of connecting networks or
          devices.
        </p>
        <p>
          You agree not to reproduce, duplicate, copy, sell, resell or exploit
          any portion of the Service, use of the Service, or access to the
          Service or any contact on the website through which the service is
          provided, without express written permission by us.
        </p>
        <p>
          The headings used in this agreement are included for convenience only
          and will not limit or otherwise affect these Terms.
        </p>
        <SubheaderText>
          SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION
        </SubheaderText>
        <p>
          We are not responsible if information made available on this site is
          not accurate, complete or current. The material on this site is
          provided for general information only and should not be relied upon or
          used as the sole basis for making decisions without consulting
          primary, more accurate, more complete or more timely sources of
          information. Any reliance on the material on this site is at your own
          risk.
        </p>
        <p>
          This site may contain certain historical information. Historical
          information, necessarily, is not current and is provided for your
          reference only. We reserve the right to modify the contents of this
          site at any time, but we have no obligation to update any information
          on our site. You agree that it is your responsibility to monitor
          changes to our site.
        </p>
        <SubheaderText>
          SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES
        </SubheaderText>
        <p>
          We reserve the right at any time to modify or discontinue the Service
          (or any part or content thereof) without notice at any time. We shall
          not be liable to you or to any third-party for any modification, price
          change, suspension or discontinuance of the Service.
        </p>
        <SubheaderText>
          SECTION 5 - PRODUCTS OR SERVICES (if applicable)
        </SubheaderText>
        <p>
          We may include descriptions or depictions of products or services for
          demonstrative purposes only. These products or services are not
          offered for sale, and no transactions or purchases can be made through
          the Service. While efforts are made to ensure the accuracy of the
          information provided, we do not guarantee the completeness or
          reliability of any products or services mentioned. All intellectual
          property rights associated with the products or services belong to
          their respective owners. The information provided should not be
          construed as professional advice, and we reserve the right to modify
          or remove any products or services at any time without notice.
        </p>
        <p>
          We do not warrant that the quality of any products, services,
          information, or other material purchased or obtained by you will meet
          your expectations, or that any errors in the Service will be
          corrected.
        </p>
        <SubheaderText>
          SECTION 6 - ACCURACY OF BILLING AND ACCOUNT INFORMATION
        </SubheaderText>
        <p>
          While our Service may include features that allow users to interact
          with payment processing services such as Stripe or PayPal, please note
          that these features are for demonstration purposes only. No actual
          transactions or payments can be processed through the project.
        </p>
        <p>
          If you choose to use any features related to payment processing
          services, including providing demo card information, you agree to
          provide accurate and complete billing and account information as
          requested. You acknowledge that any information provided for
          demonstration purposes, including demo card information, is solely for
          illustrative purposes and should not be used for real transactions.
        </p>
        <p>
          You are responsible for maintaining the confidentiality of any account
          information provided and for any activity that occurs under your
          account. We reserve the right to modify or remove any payment
          processing features at any time without notice.
        </p>
        <SubheaderText>SECTION 7 - THIRD-PARTY LINKS</SubheaderText>
        <p>
          Certain content, products and services available via our Service may
          include materials from third-parties. Third-party links on this site
          may direct you to third-party websites that are not affiliated with
          us. We are not responsible for examining or evaluating the content or
          accuracy and we do not warrant and will not have any liability or
          responsibility for any third-party materials or websites, or for any
          other materials, products, or services of third-parties.
        </p>
        <p>
          We are not liable for any harm or damages related to the purchase or
          use of goods, services, resources, content, or any other transactions
          made in connection with any third-party websites. Please review
          carefully the third-party's policies and practices and make sure you
          understand them before you engage in any transaction. Complaints,
          claims, concerns, or questions regarding third-party products should
          be directed to the third-party.
        </p>
        <SubheaderText>
          SECTION 8 - USER COMMENTS, FEEDBACK AND OTHER SUBMISSIONS
        </SubheaderText>
        <p>
          If, at our request, you send certain specific submissions (for example
          contest entries) or without a request from us you send creative ideas,
          suggestions, proposals, plans, or other materials, whether online, by
          email, by postal mail, or otherwise (collectively, 'comments'), you
          agree that we may, at any time, without restriction, edit, copy,
          publish, distribute, translate and otherwise use in any medium any
          comments that you forward to us. We are and shall be under no
          obligation (1) to maintain any comments in confidence; (2) to pay
          compensation for any comments; or (3) to respond to any comments.
        </p>
        <p>
          We may, but have no obligation to, monitor, edit or remove content
          that we determine in our sole discretion are unlawful, offensive,
          threatening, libelous, defamatory, pornographic, obscene or otherwise
          objectionable or violates any party’s intellectual property or these
          Terms of Service.
        </p>
        <p>
          You agree that your comments will not violate any right of any
          third-party, including copyright, trademark, privacy, personality or
          other personal or proprietary right. You further agree that your
          comments will not contain libelous or otherwise unlawful, abusive or
          obscene material, or contain any computer virus or other malware that
          could in any way affect the operation of the Service or any related
          website. You may not use a false e‑mail address, pretend to be someone
          other than yourself, or otherwise mislead us or third-parties as to
          the origin of any comments. You are solely responsible for any
          comments you make and their accuracy. We take no responsibility and
          assume no liability for any comments posted by you or any third-party.
        </p>
        <SubheaderText>SECTION 9 - PERSONAL INFORMATION</SubheaderText>
        <p>
          Your submission of personal information through the store is governed
          by our Privacy Policy. To view our{" "}
          <b>
            <Link href={`/privacy-policy`}>Privacy Policy.</Link>
          </b>
        </p>
        <SubheaderText>
          SECTION 10 - ERRORS, INACCURACIES AND OMISSIONS
        </SubheaderText>
        <p>
          Occasionally there may be information on our site or in the Service
          that contains typographical errors, inaccuracies or omissions that may
          relate to product descriptions, pricing, promotions, offers, product
          shipping charges, transit times and availability. We reserve the right
          to correct any errors, inaccuracies or omissions, and to change or
          update information or cancel orders if any information in the Service
          or on any related website is inaccurate at any time without prior
          notice (including after you have submitted your order).
        </p>
        <p>
          We undertake no obligation to update, amend or clarify information in
          the Service or on any related website, including without limitation,
          pricing information, except as required by law. No specified update or
          refresh date applied in the Service or on any related website, should
          be taken to indicate that all information in the Service or on any
          related website has been modified or updated.
        </p>
        <SubheaderText>SECTION 11 - PROHIBITED USES</SubheaderText>
        <p>
          In addition to other prohibitions as set forth in the Terms of
          Service, you are prohibited from using the site or its content: (a)
          for any unlawful purpose; (b) to solicit others to perform or
          participate in any unlawful acts; (c&zwnj;) to violate any
          international, federal, provincial or state regulations, rules, laws,
          or local ordinances; (d) to infringe upon or violate our intellectual
          property rights or the intellectual property rights of others; (e) to
          harass, abuse, insult, harm, defame, slander, disparage, intimidate,
          or discriminate based on gender, sexual orientation, religion,
          ethnicity, race, age, national origin, or disability; (f) to submit
          false or misleading information; (g) to upload or transmit viruses or
          any other type of malicious code that will or may be used in any way
          that will affect the functionality or operation of the Service or of
          any related website, other websites, or the Internet; (h) to collect
          or track the personal information of others; (i) to spam, phish,
          pharm, pretext, spider, crawl, or scrape; (j) for any obscene or
          immoral purpose; or (k) to interfere with or circumvent the security
          features of the Service or any related website, other websites, or the
          Internet. We reserve the right to terminate your use of the Service or
          any related website for violating any of the prohibited uses.
        </p>
        <SubheaderText>
          SECTION 12 - DISCLAIMER OF WARRANTIES; LIMITATION OF LIABILITY
        </SubheaderText>
        <p>
          We do not guarantee, represent or warrant that your use of our service
          will be uninterrupted, timely, secure or error-free.
        </p>
        <p>
          We do not warrant that the results that may be obtained from the use
          of the service will be accurate or reliable.
        </p>
        <p>
          You agree that from time to time we may remove the service for
          indefinite periods of time or cancel the service at any time, without
          notice to you.
        </p>
        <p>
          You expressly agree that your use of, or inability to use, the service
          is at your sole risk. The service and all products and services
          delivered to you through the service are (except as expressly stated
          by us) provided 'as is' and 'as available' for your use, without any
          representation, warranties or conditions of any kind, either express
          or implied, including all implied warranties or conditions of
          merchantability, merchantable quality, fitness for a particular
          purpose, durability, title, and non-infringement.
        </p>
        <p>
          In no case shall TechNexus be liable for any injury, loss, claim, or
          any direct, indirect, incidental, punitive, special, or consequential
          damages of any kind, including, without limitation lost profits, lost
          revenue, lost savings, loss of data, replacement costs, or any similar
          damages, whether based in contract, tort (including negligence),
          strict liability or otherwise, arising from your use of any of the
          service or any products procured using the service, or for any other
          claim related in any way to your use of the service or any product,
          including, but not limited to, any errors or omissions in any content,
          or any loss or damage of any kind incurred as a result of the use of
          the service or any content (or product) posted, transmitted, or
          otherwise made available via the service, even if advised of their
          possibility. Because some states or jurisdictions do not allow the
          exclusion or the limitation of liability for consequential or
          incidental damages, in such states or jurisdictions, our liability
          shall be limited to the maximum extent permitted by law.
        </p>
        <SubheaderText>SECTION 13 - INDEMNIFICATION</SubheaderText>
        <p>
          You agree to indemnify, defend and hold harmless TechNexus and our
          parent, subsidiaries, affiliates, partners, officers, directors,
          agents, contractors, licensors, service providers, subcontractors,
          suppliers, interns and employees, harmless from any claim or demand,
          including reasonable attorneys’ fees, made by any third-party due to
          or arising out of your breach of these Terms of Service or the
          documents they incorporate by reference, or your violation of any law
          or the rights of a third-party.
        </p>
        <SubheaderText>SECTION 14 - SEVERABILITY</SubheaderText>
        <p>
          In the event that any provision of these Terms of Service is
          determined to be unlawful, void or unenforceable, such provision shall
          nonetheless be enforceable to the fullest extent permitted by
          applicable law, and the unenforceable portion shall be deemed to be
          severed from these Terms of Service, such determination shall not
          affect the validity and enforceability of any other remaining
          provisions.
        </p>
        <SubheaderText>SECTION 15 - TERMINATION</SubheaderText>
        <p>
          The obligations and liabilities of the parties incurred prior to the
          termination date shall survive the termination of this agreement for
          all purposes.
        </p>
        <p>
          These Terms of Service are effective unless and until terminated by
          either you or us. You may terminate these Terms of Service at any time
          by notifying us that you no longer wish to use our Services, or when
          you cease using our site.
        </p>
        <p>
          If in our sole judgment you fail, or we suspect that you have failed,
          to comply with any term or provision of these Terms of Service, we
          also may terminate this agreement at any time without notice and you
          will remain liable for all amounts due up to and including the date of
          termination; and/or accordingly may deny you access to our Services
          (or any part thereof).
        </p>
        <SubheaderText>SECTION 16 - ENTIRE AGREEMENT</SubheaderText>
        <p>
          The failure of us to exercise or enforce any right or provision of
          these Terms of Service shall not constitute a waiver of such right or
          provision.
        </p>
        <p>
          These Terms of Service and any policies or operating rules posted by
          us on this site or in respect to The Service constitutes the entire
          agreement and understanding between you and us and govern your use of
          the Service, superseding any prior or contemporaneous agreements,
          communications and proposals, whether oral or written, between you and
          us (including, but not limited to, any prior versions of the Terms of
          Service).
        </p>
        <p>
          Any ambiguities in the interpretation of these Terms of Service shall
          not be construed against the drafting party.
        </p>
        <SubheaderText>SECTION 17 - GOVERNING LAW</SubheaderText>
        <p>
          These Terms of Service and any separate agreements whereby we provide
          you Services shall be governed by and construed in accordance with the
          laws of the United States.
        </p>
        <SubheaderText>SECTION 18 - CHANGES TO TERMS OF SERVICE</SubheaderText>
        <p>
          You can review the most current version of the Terms of Service at any
          time at this page.
        </p>
        <p>
          We reserve the right, at our sole discretion, to update, change or
          replace any part of these Terms of Service by posting updates and
          changes to our website. It is your responsibility to check our website
          periodically for changes. Your continued use of or access to our
          website or the Service following the posting of any changes to these
          Terms of Service constitutes acceptance of those changes.
        </p>
        <SubheaderText>SECTION 19 - CONTACT INFORMATION</SubheaderText>
        <p>
          Questions about the Terms of Service should be sent to us at
          help@jwtechnexus.com
        </p>
      </PrivacyPageWrapper>
    </>
  )
}

export default TermsService
