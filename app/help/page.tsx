'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

function BackArrow() {
  return (
    <svg width="22" height="18" viewBox="0 0 22 18" fill="none">
      <path
        d="M9 1L1 9L9 17M1 9H21"
        stroke="#6786AC"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DnaIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M8.667 22C9.201 21.466 9.735 20.932 9.241 18M8.667 15.334C7.334 10 8.334 9 8.667 8.667C9 8.334 10 7.334 15.334 8.667M8.667 15.334C3.334 14 2.667 14.666 2 15.333M8.667 15.334C14 16.668 15 15.666 15.333 15.333C15.666 15 16.668 14 15.334 8.667M15.334 8.667C20.667 10 21.333 9.334 22 8.667M15.333 2C14.799 2.534 14.265 3.068 14.759 6"
        stroke="#263856"
        strokeOpacity="0.6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CmPredictorHelpPage() {
  const router = useRouter();

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--gl-color-bg)',
        fontFamily: 'var(--gl-font)',
      }}
    >
      <div
        style={{
          maxWidth: 1144,
          margin: '0 auto',
          padding: isMobile ? '16px 16px 60px' : '24px 32px 60px',
        }}
      >
        {/* Top bar: back arrow + title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            marginBottom: 32,
            minHeight: 32,
          }}
        >
          <button
            onClick={() => router.push('/')}
            style={{
              position: 'absolute',
              left: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--gl-font)',
              padding: 0,
            }}
            aria-label="Back to predictor"
            className="back-button"
          >
            <BackArrow />
            <span
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: '#6786AC',
                lineHeight: '24px',
              }}
              className="back-label"
            >
              Back to predictor
            </span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <DnaIcon />
            <span
              style={{
                fontSize: 24,
                fontWeight: 600,
                color: '#263856',
                lineHeight: '32px',
              }}
            >
              Common Ancestor cM
            </span>
          </div>
        </div>

        {/* Help card */}
        <div
          style={{
            background: 'white',
            borderRadius: 12,
            padding: isMobile ? 16 : '48px 96px',
            border: '1px solid rgba(201, 214, 228, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* === Intro === */}
          <section style={sectionGroup}>
            <h1 style={h1Style}>How to use Common Ancestor cM</h1>
            <p style={tagline}>
              Predict the relationship behind a shared centiMorgan value, with segment-level analysis
              and population-aware adjustments.
            </p>

            <p style={bodyText}>
              When DNA testing companies tell you a match is your &ldquo;3rd cousin&rdquo; or &ldquo;6th cousin or
              beyond,&rdquo; that label is based purely on shared cM. The same cM value can fit several
              relationships — and for people from historically intermixed populations, much of the cM may
              come from population-level shared ancestry rather than a single recent common ancestor.
            </p>

            <p style={bodyText}>
              This tool shows the full distribution of possible relationships and lets you exclude
              segments likely inherited from population-level ancestry to reveal the true relationship signal.
            </p>
          </section>

          {/* === Quick start === */}
          <section style={sectionGroup}>
            <h2 style={h2Style}>Quick start</h2>
            <ol style={orderedList}>
              <li>Pick a demo user from the switcher in the top-right header.</li>
              <li>Click any match in the left list — predictions appear immediately on the right.</li>
              <li>For matches with 2+ segments, the <strong>Segment Analysis</strong> panel lets you exclude segments likely inherited from population-level ancestry.</li>
              <li>The <strong>population context</strong> dropdown auto-selects based on the match&apos;s ancestry and filters to only show relevant populations.</li>
              <li>Review the relationship list below — each entry is a possible relationship ranked by probability.</li>
            </ol>

            <div style={tipCallout}>
              <div style={calloutTitle}>Tip</div>
              <div>
                The Segment Analysis panel only appears for matches with multiple segments.
                For close relatives (parents, siblings, grandparents) the relationship is unambiguous
                from cM alone — no segment exclusion needed.
              </div>
            </div>
          </section>

          {/* === Reference TOC === */}
          <section style={sectionGroup}>
            <h2 style={h2Style}>Reference</h2>
            <div style={tocLabel}>Table of contents</div>
            <div style={tocGrid} className="toc-grid">
              <div style={tocColumn}>
                <div style={tocGroupTitle}>Getting started</div>
                <a href="#what-is-cm" style={tocLink}>
                  What is a centiMorgan?
                </a>
                <a href="#histogram" style={tocLink}>
                  Reading the relationship list
                </a>
                <a href="#one-cm-many-relationships" style={tocLink}>
                  Why one cM value fits several relationships
                </a>
                <a href="#shared-cm-project" style={tocLink}>
                  The Shared cM Project (V4)
                </a>
              </div>
              <div style={tocColumn}>
                <div style={tocGroupTitle}>Segment analysis</div>
                <a href="#segment-analysis" style={tocLink}>
                  How segment exclusion works
                </a>
                <a href="#population-context" style={tocLink}>
                  Population context and auto-detection
                </a>
                <a href="#populations-table" style={tocLink}>
                  The 8 supported populations
                </a>
                <a href="#ibd-hotspots" style={tocLink}>
                  IBD hotspot regions
                </a>
                <div style={{ ...tocGroupTitle, marginTop: 16 }}>Demo &amp; glossary</div>
                <a href="#demo-data" style={tocLink}>
                  About the demo data
                </a>
                <a href="#glossary" style={tocLink}>
                  Glossary
                </a>
              </div>
            </div>
          </section>

          {/* === What is cM === */}
          <section id="what-is-cm" style={sectionGroup}>
            <h3 style={h3Style}>What is a centiMorgan?</h3>
            <p style={bodyText}>
              A centiMorgan (cM) is a unit of genetic distance. Two people share more cM the more recently
              they share a common ancestor. Identical twins share ~3,500 cM; 4th cousins share an average of
              35 cM (range 0–139); 8th cousins share an average of 4 cM, often 0.
            </p>
            <p style={bodyText}>
              Every DNA testing company computes shared cM the same way under the hood, but small differences
              in chip versions and matching thresholds mean two vendors may report slightly different values
              for the same biological match.
            </p>
          </section>

          {/* === Reading the relationship list === */}
          <section id="histogram" style={sectionGroup}>
            <h3 style={h3Style}>Reading the relationship list</h3>
            <p style={bodyText}>
              When you click a match, the relationship list shows every relationship class compatible with
              the shared cM, ranked by probability. If you&apos;ve excluded segments, the predictions use the
              reduced &ldquo;effective cM&rdquo; instead of the raw total.
            </p>
            <p style={bodyText}>
              The top relationship is the <em>statistical best fit</em>, but several others may be similarly
              likely. Use tree research, segment data, and known relatives to narrow down further.
            </p>
          </section>

          {/* === Why one cM, many relationships === */}
          <section id="one-cm-many-relationships" style={sectionGroup}>
            <h3 style={h3Style}>Why one cM value fits several relationships</h3>
            <p style={bodyText}>
              DNA inheritance is random. The same cM bracket fits multiple relationships because the cM range
              for one relationship class overlaps the next. For example, 100 cM matches all of: half 1st
              cousin, 2nd cousin, 1st cousin twice removed, and several other distant variants.
            </p>
            <p style={bodyText}>
              The histogram surfaces all of them with their relative likelihoods so you don&apos;t commit to a
              single label too early.
            </p>
          </section>

          {/* === Shared cM Project === */}
          <section id="shared-cm-project" style={sectionGroup}>
            <h3 style={h3Style}>The Shared cM Project (V4)</h3>
            <p style={bodyText}>
              Predictions are based on the V4 Shared cM Project tables (Bettinger / Larkin / Perl), the most
              widely used reference data for crowdsourced genealogical cM. The project covers 34 relationship
              classes from identical twin to 8th cousin.
            </p>
          </section>

          {/* === Segment analysis === */}
          <section id="segment-analysis" style={sectionGroup}>
            <h3 style={h3Style}>How segment exclusion works</h3>
            <p style={bodyText}>
              For matches with two or more segments, the Segment Analysis panel lets you exclude
              individual segments from the cM total. This is useful when some segments are likely
              inherited from population-level shared ancestry (endogamy) rather than a recent common ancestor.
            </p>
            <p style={bodyText}>
              Each segment is scored by two factors: whether it overlaps a known IBD hotspot region
              for the selected population, and its size (smaller segments are more likely to be
              population-inherited, since they&apos;ve had more generations of recombination). Segments
              scoring highest are auto-excluded up to the population&apos;s baseline cM floor.
            </p>
            <p style={bodyText}>
              You can override the defaults by clicking any segment row to toggle it. The
              &ldquo;Include all&rdquo; and &ldquo;Exclude all&rdquo; buttons let you start fresh.
              The effective cM (after exclusions) feeds directly into the relationship predictions below.
            </p>

            <div style={tipCallout}>
              <div style={calloutTitle}>Example</div>
              <div>
                Two Ashkenazi-descended people share <strong>170 cM</strong> across 9 segments. With the Ashkenazi
                population context selected, the tool auto-excludes ~80 cM worth of small segments in known
                hotspot regions. The remaining ~90 cM points to a 3rd cousin — not the 2nd cousin that
                the raw 170 cM would suggest.
              </div>
            </div>
          </section>

          {/* === Population context === */}
          <section id="population-context" style={sectionGroup}>
            <h3 style={h3Style}>Population context and auto-detection</h3>
            <p style={bodyText}>
              The population context dropdown in the Segment Analysis panel controls which IBD hotspot
              regions are checked and how much baseline cM to subtract. When you click a match,
              the tool automatically selects the most likely population based on the match&apos;s ancestry composition.
            </p>
            <p style={bodyText}>
              The dropdown only shows populations relevant to each match&apos;s ancestry — an East Asian
              match won&apos;t show Ashkenazi or Acadian options. You can always override the selection
              or switch to &ldquo;None / Outbred&rdquo; to disable population-level adjustments entirely.
            </p>
          </section>

          {/* === Populations table === */}
          <section id="populations-table" style={sectionGroup}>
            <h3 style={h3Style}>The 8 supported populations</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={table}>
                <thead>
                  <tr>
                    <th style={th}>Population</th>
                    <th style={th}>Era / context</th>
                    <th style={th}>Baseline cM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={td}>None / Outbred</td>
                    <td style={td}>Use for outbred populations</td>
                    <td style={tdNum}>0</td>
                  </tr>
                  <tr style={tdAlt}>
                    <td style={td}>Baltic / Slavic</td>
                    <td style={td}>Polish-Lithuanian Commonwealth (1569–1795)</td>
                    <td style={tdNum}>~25</td>
                  </tr>
                  <tr>
                    <td style={td}>Ashkenazi Jewish</td>
                    <td style={td}>Pale of Settlement (1791–1917) and earlier bottleneck</td>
                    <td style={tdNum}>~80</td>
                  </tr>
                  <tr style={tdAlt}>
                    <td style={td}>Iberian / Latin American Colonial</td>
                    <td style={td}>Spanish &amp; Portuguese colonization (1500s–1800s)</td>
                    <td style={tdNum}>~40</td>
                  </tr>
                  <tr>
                    <td style={td}>Acadian / Quebec French</td>
                    <td style={td}>New France (1604–1763) and Acadian diaspora</td>
                    <td style={tdNum}>~90</td>
                  </tr>
                  <tr style={tdAlt}>
                    <td style={td}>British &amp; Irish Colonial American</td>
                    <td style={td}>British colonization of North America (1607–1776)</td>
                    <td style={tdNum}>~35</td>
                  </tr>
                  <tr>
                    <td style={td}>Mennonite / Amish</td>
                    <td style={td}>Anabaptist diaspora (1525–present)</td>
                    <td style={tdNum}>~150</td>
                  </tr>
                  <tr style={tdAlt}>
                    <td style={td}>Icelandic</td>
                    <td style={td}>Norse settlement (~874 CE) and continued isolation</td>
                    <td style={tdNum}>~50</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p style={{ ...bodyText, fontSize: 13, color: 'var(--gl-color-text-muted)' }}>
              Baseline values are approximations from genealogical literature. Treat as guidance, not exact figures.
            </p>
          </section>

          {/* === IBD hotspots === */}
          <section id="ibd-hotspots" style={sectionGroup}>
            <h3 style={h3Style}>IBD hotspot regions</h3>
            <p style={bodyText}>
              Certain chromosomal regions are known to produce excess IBD sharing in specific populations.
              These include regions under balancing selection (like the HLA/MHC complex on chromosome 6),
              pericentromeric regions with low recombination, and population-specific founder haplotypes.
            </p>
            <p style={bodyText}>
              When a segment overlaps one of these hotspot regions, it&apos;s flagged with an
              &ldquo;IBD&rdquo; badge in the segment list. Hotspot overlap is the strongest signal
              in the exclusion scoring — a segment sitting squarely in a known Ashkenazi founder
              haplotype region is very likely population-inherited, regardless of its size.
            </p>
            <p style={bodyText}>
              Segments that are triangulated (shared with a third person) are marked with
              a &ldquo;TRI&rdquo; badge — these are more likely to represent recent shared ancestry
              and are worth keeping included.
            </p>
          </section>

          {/* === Demo data === */}
          <section id="demo-data" style={sectionGroup}>
            <h3 style={h3Style}>About the demo data</h3>
            <p style={bodyText}>
              The 10 demo users (and their ~1,700 matches each) are derived from a real DNA-pair dataset
              (~254,000 pairs with segment-level data and computed kinship labels). User identities and
              matched-person ancestry profiles are <strong>synthesized deterministically</strong> from the encrypted user
              IDs, so the names and ancestry compositions you see are plausible but fictional.
            </p>
            <p style={bodyText}>
              The cM values, segment positions, and relationship labels are all <strong>real</strong> — they come straight
              from the source data. The stratified sampling ensures each demo user has matches across the
              full kinship range (close, mid, distant) for interesting predictions.
            </p>
          </section>

          {/* === Glossary === */}
          <section id="glossary" style={sectionGroup}>
            <h3 style={h3Style}>Glossary</h3>
            <dl style={glossary}>
              <dt style={dt}>centiMorgan (cM)</dt>
              <dd style={dd}>Unit of genetic distance. ~3,500 cM = identical twin; 4 cM ≈ 8th cousin average.</dd>

              <dt style={dt}>Shared cM</dt>
              <dd style={dd}>The total cM across all matching segments between you and another person.</dd>

              <dt style={dt}>Effective cM</dt>
              <dd style={dd}>The cM remaining after excluding segments flagged as population-inherited. This value drives the relationship predictions.</dd>

              <dt style={dt}>MRCA</dt>
              <dd style={dd}>Most Recent Common Ancestor — the most recent person from whom both you and a match descend.</dd>

              <dt style={dt}>Endogamy</dt>
              <dd style={dd}>Sustained marriage within a community. Inflates shared cM because cousins share ancestors many times over.</dd>

              <dt style={dt}>IBD (Identity-by-Descent)</dt>
              <dd style={dd}>A DNA segment shared because both people inherited it from a common ancestor (rather than by random chance).</dd>

              <dt style={dt}>IBD hotspot</dt>
              <dd style={dd}>A chromosomal region where members of an endogamous population commonly share DNA from ancient ancestry, not recent relationships.</dd>

              <dt style={dt}>Segment</dt>
              <dd style={dd}>A continuous run of DNA shared between you and a match — defined by chromosome, start position, end position, and length in cM.</dd>

              <dt style={dt}>Triangulated</dt>
              <dd style={dd}>A segment shared with a third person as well, suggesting it came from a recent common ancestor rather than population-level ancestry.</dd>

              <dt style={dt}>Population floor</dt>
              <dd style={dd}>The approximate cM that two unrelated members of an endogamous population share by default from their shared history.</dd>

              <dt style={dt}>V4 Shared cM Project</dt>
              <dd style={dd}>The 4th-version (2020) crowdsourced reference table from Blaine Bettinger et al., used here for relationship probability lookup.</dd>
            </dl>
          </section>

          {/* === CTA === */}
          <div style={{ marginTop: 8, display: 'flex', justifyContent: 'flex-start' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '12px 28px',
                borderRadius: 32,
                background: 'var(--gl-color-primary-attention)',
                color: 'white',
                border: 'none',
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'var(--gl-font)',
                lineHeight: '20px',
              }}
            >
              Open the predictor
            </button>
          </div>
        </div>
      </div>

      {/* Mobile responsive tweaks */}
      <style jsx global>{`
        @media (max-width: 600px) {
          .toc-grid {
            grid-template-columns: 1fr !important;
          }
          .back-label {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}

// ============================================================================
// Style constants
// ============================================================================

const sectionGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  scrollMarginTop: 24,
};

const h1Style: React.CSSProperties = {
  fontSize: 32,
  fontWeight: 600,
  color: '#263856',
  lineHeight: '36px',
  margin: 0,
};

const tagline: React.CSSProperties = {
  fontSize: 16,
  color: '#6786AC',
  lineHeight: '24px',
  margin: 0,
};

const h2Style: React.CSSProperties = {
  fontSize: 24,
  fontWeight: 600,
  color: '#263856',
  lineHeight: '32px',
  margin: 0,
  marginTop: 8,
};

const h3Style: React.CSSProperties = {
  fontSize: 20,
  fontWeight: 600,
  color: '#263856',
  lineHeight: '28px',
  margin: 0,
};

const bodyText: React.CSSProperties = {
  fontSize: 16,
  color: '#263856',
  lineHeight: '24px',
  margin: 0,
};

const orderedList: React.CSSProperties = {
  margin: 0,
  paddingLeft: 24,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  fontSize: 16,
  color: '#263856',
  lineHeight: '24px',
};

const tipCallout: React.CSSProperties = {
  background: 'rgba(122, 184, 255, 0.1)',
  border: '1px solid rgba(122, 184, 255, 0.3)',
  borderRadius: 16,
  padding: '12px 16px',
  fontSize: 14,
  color: '#263856',
  lineHeight: '22px',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
};

const calloutTitle: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 700,
  color: '#245FA4',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const tocLabel: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  color: '#6786AC',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  marginBottom: 4,
};

const tocGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 24,
};

const tocColumn: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
};

const tocGroupTitle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#263856',
};

const tocLink: React.CSSProperties = {
  fontSize: 14,
  color: '#FF7C11',
  textDecoration: 'none',
  paddingLeft: 4,
};

const table: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 14,
};

const th: React.CSSProperties = {
  textAlign: 'left',
  background: 'rgba(122, 184, 255, 0.12)',
  color: '#263856',
  fontWeight: 700,
  padding: '10px 12px',
  borderBottom: '1px solid rgba(201, 214, 228, 0.6)',
};

const td: React.CSSProperties = {
  padding: '10px 12px',
  color: '#263856',
  lineHeight: '20px',
  borderBottom: '1px solid rgba(201, 214, 228, 0.4)',
};

const tdNum: React.CSSProperties = {
  ...td,
  textAlign: 'right',
  fontWeight: 600,
};

const tdAlt: React.CSSProperties = {
  background: 'rgba(245, 248, 252, 0.6)',
};

const glossary: React.CSSProperties = {
  margin: 0,
  display: 'grid',
  gridTemplateColumns: '180px 1fr',
  gap: '8px 16px',
};

const dt: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 600,
  color: '#263856',
  paddingTop: 4,
};

const dd: React.CSSProperties = {
  fontSize: 14,
  color: '#263856',
  lineHeight: '22px',
  margin: 0,
};
