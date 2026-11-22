'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RefundPolicyPage() {
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
          Refund Policy — MathAround
        </h1>
        <p
          style={{
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            margin: '0 0 1.2rem 0',
            fontWeight: '600',
          }}
        >
          Last Updated: November 22, 2026
        </p>

        <div style={sectionCardStyle}>
          <p style={bodyTextStyle}>
            This Refund Policy outlines how cancellations and refund requests are
            handled for <strong>MathAround Pro</strong> subscriptions on{' '}
            <a href="https://matharoundapp.com" style={linkStyle}>
              https://matharoundapp.com
            </a>
            . All payments for MathAround Pro ($8.99/month) are processed by{' '}
            <strong>Paddle</strong> as our merchant of record.
          </p>
        </div>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>1. Subscriptions &amp; Cancellations</h2>
          <ul style={listStyle}>
            <li>
              <strong>Cancel Anytime:</strong> You can cancel your MathAround
              Pro subscription at any time from your subscription
              page before your next renewal date.
            </li>
            <li>
              <strong>Effect of Cancellation:</strong> Canceling stops future
              recurring charges. You will continue to have full access to
              MathAround Pro features through the end of your current paid
              billing period.
            </li>
            <li>
              <strong>No Partial-Period Proration:</strong> Unless eligible
              under Section 2 below or required by applicable law, partial
              monthly billing periods are not prorated or refunded once a
              billing cycle has started.
            </li>
          </ul>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>2. Refund Eligibility</h2>
          <p style={{ ...bodyTextStyle, marginBottom: '0.65rem' }}>
            We review refund requests fairly and in accordance with Paddle&apos;s
            Buyer Terms and applicable consumer protection laws. You may request
            a refund within <strong>14 days</strong> of a transaction if:
          </p>
          <ul style={listStyle}>
            <li>
              You were accidentally charged twice or experienced a billing
              error;
            </li>
            <li>
              A verified technical issue prevented you from accessing MathAround
              Pro features and could not be resolved by support; or
            </li>
            <li>
              A refund is required under mandatory consumer rights in your
              country or region.
            </li>
          </ul>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>3. How to Request a Refund</h2>
          <p style={bodyTextStyle}>
            To request a refund or get help with a billing issue, email{' '}
            <a href="mailto:matharoundapp@gmail.com" style={linkStyle}>
              matharoundapp@gmail.com
            </a>{' '}
            with your account email address and your Paddle receipt or
            transaction ID. You may also contact Paddle buyer support directly
            via your Paddle order receipt. Please reach out to us before
            initiating a bank or card chargeback so we can resolve the issue
            promptly.
          </p>
        </section>

        <section style={sectionCardStyle}>
          <h2 style={sectionHeadingStyle}>4. Merchant of Record</h2>
          <p style={bodyTextStyle}>
            Paddle acts as the merchant of record for all MathAround Pro orders
            and handles payment processing, receipts, tax collection, and
            approved refund disbursements back to your original payment method.
          </p>
        </section>
      </div>
    </div>
  );
}