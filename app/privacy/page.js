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
          Privacy Policy — MathAround
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
            This Privacy Policy explains how <strong>MathAround</strong>{' '}
            (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) collects,
            uses, and handles information when you visit{' '}
            <a href="https://matharoundapp.com" style={linkStyle}>
              https://matharoundapp.com
            </a>{' '}
            or use our associated web and mobile applications (collectively, the
            &ldquo;Service&rdquo;). MathAround is designed for learners of all
            ages.
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>1. Information We Collect</h2>
          <ul style={listStyle}>
            <li>
              <strong>Account &amp; Profile Information:</strong> When you
              register, we collect your email address, username, and password,
              along with verification and subscription status. We do not collect
              or require age or date of birth.
            </li>
            <li>
              <strong>Learning &amp; Preferences:</strong> We store your math
              practice progress and account settings. Your browser may also use{' '}
              <code>localStorage</code> (such as <code>matharound_theme</code>)
              to remember interface preferences. We do not use tracking cookies.
            </li>
            <li>
              <strong>AI Helper Chats &amp; Usage:</strong> Questions and
              messages in the AI helper are stored in Supabase while active so
              you can view your chat history, along with usage counts needed to
              enforce limits such as the 100-question daily cap.
            </li>
            <li>
              <strong>Subscription &amp; Billing Data:</strong> MathAround Pro
              ($8.99/month) subscriptions are processed by{' '}
              <strong>Paddle</strong> as our merchant of record. Paddle handles
              payment details, billing location, and applicable taxes; we only
              receive subscription/billing status needed to manage your access.
            </li>
            <li>
              <strong>Support &amp; Technical Logs:</strong> Messages you send to{' '}
              <a href="mailto:matharoundapp@gmail.com" style={linkStyle}>
                matharoundapp@gmail.com
              </a>{' '}
              and standard operational/security logs.
            </li>
          </ul>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>2. How We Use Information</h2>
          <ul style={listStyle}>
            <li>
              Provide, maintain, and verify user accounts and math practice
              features;
            </li>
            <li>
              Generate AI helper responses, maintain active chat history, and
              enforce daily usage limits;
            </li>
            <li>
              Process and manage MathAround Pro subscriptions through Paddle;
            </li>
            <li>
              Protect the Service against abuse, bots, or security issues, and
              respond to support requests.
            </li>
          </ul>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>3. AI Helper &amp; OpenAI API</h2>
          <p style={bodyTextStyle}>
            When you use the AI helper, your prompt/question is sent to the{' '}
            <strong>OpenAI API</strong> to generate a response, and active chat
            history is stored in Supabase. Under OpenAI&apos;s API data terms,
            data submitted through the API is not used by default to train
            OpenAI&apos;s models (unless opted in), though OpenAI may retain API
            data temporarily (such as for abuse monitoring) in accordance with
            its API policies. Deleting a chat in MathAround
            removes that chat from active storage. Avoid entering sensitive
            personal or confidential details into AI prompts.
          </p>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>4. Third-Party Service Providers</h2>
          <ul style={listStyle}>
            <li>
              <strong>Supabase:</strong> Provides backend database storage,
              authentication, and related infrastructure for accounts, profiles,
              and active AI helper chats.
            </li>
            <li>
              <strong>OpenAI:</strong> Processes AI helper requests via the
              OpenAI API to generate educational responses and hints.
            </li>
            <li>
              <strong>Paddle:</strong> Acts as our merchant of record and payment
              processor for MathAround Pro subscriptions, calculating and
              collecting applicable taxes at checkout and handling recurring
              billing.
            </li>
            <li>
              <strong>Hosting &amp; Infrastructure Providers:</strong> Services
              used to host and serve the web or mobile application.
            </li>
          </ul>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>
            5. Deleting Chats &amp; Deleting Your Profile
          </h2>
          <p style={bodyTextStyle}>
            You can delete individual AI helper chats at any time, which
            removes them from your chats. You can also delete your account/profile
            through the Service, which deletes or removes your profile and
            associated account data from active storage, except where limited
            records (such as billing/tax records handled through Paddle,
            security logs, or legal compliance records) must be retained by law
            or payment rules.
          </p>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>6. All Ages &amp; Contact</h2>
          <p style={{ ...bodyTextStyle, marginBottom: '0.65rem' }}>
            MathAround is intended for users of all ages without age gating. If
            you are under the age required in your jurisdiction to consent to
            online services or data processing on your own, please use the
            Service with a parent or legal guardian.
          </p>
          <p style={bodyTextStyle}>
            Questions or privacy requests can be sent to{' '}
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