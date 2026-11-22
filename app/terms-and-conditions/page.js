'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TermsAndConditionsPage() {
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('matharound_theme');
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const sectionCardStyle = {
    padding: '1.6rem',
    background: 'var(--card-bg)',
    border: '1px solid var(--surface-border)',
    borderRadius: '20px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
  };

  const sectionHeadingStyle = {
    fontSize: '1.15rem',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: '0 0 0.65rem 0',
    letterSpacing: '-0.02em',
  };

  const bodyTextStyle = {
    fontSize: '0.95rem',
    lineHeight: 1.65,
    color: 'var(--text-main)',
    margin: 0,
  };

  const listStyle = {
    margin: '0.5rem 0 0 0',
    paddingLeft: '1.35rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.55rem',
    fontSize: '0.95rem',
    lineHeight: 1.6,
    color: 'var(--text-main)',
  };

  const linkStyle = {
    color: 'var(--accent-neon)',
    fontWeight: '700',
    textDecoration: 'none',
  };

  return (
    <div
      style={{
        padding: '2.5rem 1.5rem 4.5rem',
        maxWidth: '760px',
        minHeight: '100vh',
        margin: '0 auto',
        color: 'var(--text-main)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => {
            if (window.history.length > 1) {
              router.back();
            } else {
              router.push('/');
            }
          }}
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--surface-border)',
            borderRadius: '999px',
            padding: '0.5rem 1rem',
            color: 'var(--text-main)',
            fontWeight: '700',
            fontSize: '0.85rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
      </div>

      <header style={{ marginBottom: '2rem' }}>
        <p
          style={{
            fontSize: '0.75rem',
            fontWeight: '800',
            letterSpacing: '0.1em',
            color: 'var(--accent-neon)',
            margin: '0 0 0.4rem 0',
            textTransform: 'uppercase',
          }}
        >
          Legal
        </p>
        <h1
          style={{
            fontSize: '2.1rem',
            fontWeight: '900',
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            margin: '0 0 0.4rem 0',
          }}
        >
          Terms and Conditions — MathAround
        </h1>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            margin: '0 0 1.2rem 0',
            fontWeight: '600',
          }}
        >
          Last Updated: November 20, 2026
        </p>

        <div style={sectionCardStyle}>
          <p style={bodyTextStyle}>
            Welcome to <strong>MathAround</strong> (&ldquo;we,&rdquo;
            &ldquo;our,&rdquo; or &ldquo;us&rdquo;), accessible via{' '}
            <a href="https://matharoundapp.com" style={linkStyle}>
              https://matharoundapp.com
            </a>{' '}
            and any associated web or mobile applications (collectively, the
            &ldquo;Service&rdquo;). By accessing or using the Service, you agree to
            be bound by these Terms and Conditions (&ldquo;Terms&rdquo;). If you do
            not agree to these Terms, do not access or use the Service.
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>
1. Nature of the Service &amp; Educational Disclaimer
          </h2>
          <p style={bodyTextStyle}>
            MathAround is an interactive math practice and learning platform
            dedicated to mathematics. Practice questions, lessons, explanations,
            and AI helper responses are provided for educational and
            informational purposes only. While we aim for accuracy and helpful
            explanations, we do not guarantee that all generated problems,
            solutions, or AI responses will be free of errors or satisfy any
            specific academic, testing, or grading requirement.
          </p>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>2. Eligibility</h2>
          <p style={bodyTextStyle}>
            There is no strict minimum age to use MathAround. However, if you are
            under the age of majority in your jurisdiction (or under the age
            required to consent to online services or data processing without
            parental approval where you live), you may use the Service only with
            the involvement, supervision, and consent of a parent or legal
            guardian. By allowing a minor to use the Service, that parent or
            guardian agrees to these Terms on the minor&apos;s behalf.
          </p>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>
3. Accounts, Verification, and Account Management
          </h2>
          <ul style={listStyle}>
            <li>
              <strong>Registration &amp; Verification:</strong> To register for an
              account, you must provide a valid email address, a username, and a
              password. You must complete email verification to activate and
              maintain full access to your account.
            </li>
            <li>
              <strong>Account Security:</strong> You are responsible for keeping
              your password and account credentials confidential and for all
              activity that occurs under your account. Choose a unique, strong
              password and notify us promptly at{' '}
              <a href="mailto:matharoundapp@gmail.com" style={linkStyle}>
                matharoundapp@gmail.com
              </a>{' '}
              if you suspect unauthorized access.
            </li>
            <li>
              <strong>Email &amp; Password Changes:</strong> Through your account
              settings, you may update your password and request to change your
              email address. Email address changes require verification of the new
              email address before taking effect.
            </li>
            <li>
              <strong>Account Deletion:</strong> You may delete your account at
              any time through your account settings. Deleting your account
              removes or deactivates your account access in accordance with our
              system workflows and data retention practices; certain technical
              logs, payment/billing records, or legal compliance records may be
              retained where required or permitted by law.
            </li>
            <li>
              <strong>Suspension or Termination:</strong> We reserve the right to
              suspend or terminate accounts that violate these Terms, abuse the
              Service, or interfere with other users or system operations.
            </li>
          </ul>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>
4. Free Tier and MathAround Pro Subscription
          </h2>
          <ul style={listStyle}>
            <li>
              <strong>Free Version:</strong> MathAround offers a free tier with
              access to core math practice features, subject to any feature limits
              or changes we may apply from time to time.
            </li>
            <li>
              <strong>MathAround Pro ($8.99/Month):</strong> We offer an
              optional paid subscription called MathAround Pro priced at $8.99 per
              month, excluding applicable taxes. Paddle acts as our merchant of
              record for paid subscriptions and calculates, collects, and remits
              applicable sales tax, VAT, or other taxes at checkout based on your
              billing location.
            </li>
            <li>
              <strong>Billing, Renewal, &amp; Cancellation:</strong> If you
              purchase MathAround Pro, you authorize Paddle (our payment
              processor and merchant of record) to charge $8.99/month plus any
              applicable taxes on a recurring monthly basis until you cancel. You
              may cancel your subscription before your next billing date in
              accordance with the billing instructions provided at checkout, via
              Paddle&apos;s billing portal/link, or in your account settings;
              cancellation stops future recurring charges, though payments already
              processed are non-refundable except where required by applicable law
              or permitted under Paddle&apos;s refund terms.
            </li>
            <li>
              <strong>Price &amp; Plan Changes:</strong> Subscription pricing,
              features, or tiers may change in the future with advance notice
              before a new billing cycle begins.
            </li>
          </ul>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>
5. AI Helper, Chat Storage, &amp; Daily Usage Limits
          </h2>
          <p style={bodyTextStyle}>
            MathAround includes an AI helper feature designed to assist with math
            learning and practice. AI helper questions and chat history are
            stored in Supabase while active, and you can delete chats at any
            time, after which they are removed from active chat storage.
          </p>
          <ul style={listStyle}>
            <li>
              <strong>Daily Limit:</strong> Use of the AI helper is subject to a
              limit of 100 questions per day (subject to reset rules and any
              technical adjustments needed to keep the Service reliable and fair
              for all users).
            </li>
            <li>
              <strong>AI Output &amp; Responsibility:</strong> AI-generated hints,
              steps, and explanations are automated and may occasionally make
              mistakes or misinterpret ambiguous prompts. You should review AI
              responses critically rather than relying on them blindly.
            </li>
            <li>
              <strong>Prohibited AI Use:</strong> You may not use automated
              scripts, bots, or workarounds to bypass the 100-question daily
              limit, scrape AI outputs at scale, or submit harmful, abusive, or
              unlawful prompts.
            </li>
          </ul>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>6. Acceptable Use</h2>
          <p style={bodyTextStyle}>You agree not to:</p>
          <ol style={listStyle}>
            <li>
              Use the Service for any unlawful purpose or in violation of
              applicable local, state, national, or international laws;
            </li>
            <li>
              Attempt to gain unauthorized access to any user accounts,
              databases, servers, or backend systems (including our Supabase
              infrastructure);
            </li>
            <li>
              Interfere with, disrupt, overload, or reverse-engineer any part of
              the Service;
            </li>
            <li>
              Use automated bots, scrapers, or cheat tools to harvest content or
              disrupt normal platform operation; or
            </li>
            <li>
              Impersonate another person or misrepresent your affiliation with any
              person or entity.
            </li>
          </ol>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>
7. Backend &amp; Third-Party Services
          </h2>
          <p style={bodyTextStyle}>
            MathAround relies on third-party infrastructure and service providers
            to operate—including Supabase for backend services (such as
            authentication, database storage, and related backend operations) and
            Paddle as our merchant of record and payment processor for
            subscriptions and tax handling, as well as hosting and analytics
            providers as applicable. Your use of the Service may also be subject
            to the terms and policies of those underlying providers to the extent
            they interact with your use of MathAround. We are not responsible for
            outages, delays, or issues caused by third-party providers outside
            our reasonable control.
          </p>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>8. Intellectual Property</h2>
          <p style={bodyTextStyle}>
            All content, software, code, curriculum structure, math problem
            generators, visual assets, branding, logos, and text making up
            MathAround (excluding content you submit) are the property of
            MathAround or its licensors and are protected by copyright,
            trademark, and other intellectual property laws. Subject to your
            compliance with these Terms, we grant you a limited, non-exclusive,
            non-transferable, revocable license to access and use the Service for
            personal, non-commercial educational use. You may not copy,
            republish, sell, sublicense, or commercially exploit the Service or
            its materials without our prior written permission.
          </p>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>9. Disclaimers of Warranties</h2>
          <p style={{ ...bodyTextStyle, textTransform: 'uppercase' }}>
            THE SERVICE IS PROVIDED ON AN &ldquo;AS IS&rdquo; AND &ldquo;AS
            AVAILABLE&rdquo; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER
            EXPRESS, IMPLIED, OR STATUTORY, INCLUDING ANY IMPLIED WARRANTIES OF
            MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
            NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE
            UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT DEFECTS WILL
            BE CORRECTED.
          </p>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>10. Limitation of Liability</h2>
          <p style={{ ...bodyTextStyle, textTransform: 'uppercase' }}>
            TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
            MATHAROUND OR ITS OPERATORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL,
            SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR ANY LOSS
            OF DATA, PROFITS, REVENUE, OR GOODWILL, ARISING OUT OF OR RELATING TO
            YOUR ACCESS TO OR USE OF (OR INABILITY TO USE) THE SERVICE, EVEN IF
            ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. TO THE EXTENT PERMITTED BY
            LAW, OUR TOTAL AGGREGATE LIABILITY FOR ANY CLAIM ARISING OUT OF OR
            RELATING TO THESE TERMS OR THE SERVICE WILL NOT EXCEED THE GREATER OF
            (A) THE AMOUNT YOU PAID FOR MATHAROUND PRO IN THE THREE (3) MONTHS
            PRECEDING THE EVENT GIVING RISE TO LIABILITY OR (B) TWENTY DOLLARS
            ($20).
          </p>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>11. Changes to These Terms</h2>
          <p style={bodyTextStyle}>
            We may update these Terms from time to time as MathAround evolves.
            When we make changes, we will post the updated Terms on{' '}
            <a href="https://matharoundapp.com" style={linkStyle}>
              matharoundapp.com
            </a>{' '}
            and update the &ldquo;Last Updated&rdquo; date at the top. Your
            continued use of the Service after updated Terms take effect means
            you accept the revised Terms.
          </p>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>12. Governing Law &amp; Contact</h2>
          <p style={{ ...bodyTextStyle, marginBottom: '0.65rem' }}>
            These Terms are governed by and construed in accordance with the laws
            of the State of Maine, United States, without regard to
            conflict-of-law principles.
          </p>
          <p style={bodyTextStyle}>
            If you have questions about these Terms or your account, contact us
            at{' '}
            <a href="mailto:matharoundapp@gmail.com" style={linkStyle}>
              matharoundapp@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}