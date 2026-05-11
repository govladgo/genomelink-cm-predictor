'use client';

import React from 'react';
import Link from 'next/link';
import { AppHeader } from '@/components/AppHeader';

export default function CmPredictorHelpPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--gl-color-bg)',
        fontFamily: 'var(--gl-font)',
      }}
    >
      <AppHeader />

      <div
        className="help-page-container"
        style={{
          maxWidth: 1144,
          margin: '0 auto',
          padding: '24px 32px 60px',
        }}
      >
        {/* Help card */}
        <div
          className="help-card"
          style={{
            background: 'white',
            borderRadius: 12,
            padding: '48px 96px',
            border: '1px solid rgba(201, 214, 228, 0.6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 24,
          }}
        >
          {/* === Intro === */}
          <section style={sectionGroup}>
            <h1 style={h1Style}>How to use cM Clarity</h1>
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

            <p style={bodyText}>
              For example, two M&#257;ori individuals may show as 2nd cousins based on raw shared cM,
              but much of that sharing comes from population-level ancestry rather than a recent
              common ancestor. After excluding those population-inherited segments, the true
              relationship might be 4th cousins or more distant.
            </p>
          </section>

          {/* === Quick start === */}
          <section style={sectionGroup}>
            <h2 style={h2Style}>Quick start</h2>
            <ol style={orderedList}>
              <li>Select a match from the left panel — your DNA matches are listed by shared cM.</li>
              <li>Predictions appear immediately on the right, showing every relationship class compatible with the shared cM.</li>
              <li>For matches with 2+ segments, the <strong>Segment Analysis</strong> panel lets you exclude segments likely inherited from population-level ancestry.</li>
              <li>Use the <strong>population context</strong> dropdown to select the relevant ancestral population — it auto-selects based on the match&apos;s ancestry composition.</li>
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
                <a href="#what-is-cm" className="toc-link" style={tocLink}>
                  What is a centiMorgan?
                </a>
                <a href="#histogram" className="toc-link" style={tocLink}>
                  Reading the relationship list
                </a>
                <a href="#one-cm-many-relationships" className="toc-link" style={tocLink}>
                  Why one cM value fits several relationships
                </a>
                <a href="#shared-cm-project" className="toc-link" style={tocLink}>
                  The Shared cM Project (V4)
                </a>
              </div>
              <div style={tocColumn}>
                <div style={tocGroupTitle}>Segment analysis</div>
                <a href="#segment-analysis" className="toc-link" style={tocLink}>
                  How segment exclusion works
                </a>
                <a href="#population-context" className="toc-link" style={tocLink}>
                  Population context and auto-detection
                </a>
                <a href="#populations-table" className="toc-link" style={tocLink}>
                  The 8 supported populations
                </a>
                <a href="#ibd-hotspots" className="toc-link" style={tocLink}>
                  IBD hotspot regions
                </a>
                <div style={{ ...tocGroupTitle, marginTop: 16 }}>Reference</div>
                <a href="#about-data" className="toc-link" style={tocLink}>
                  About the data
                </a>
                <a href="#glossary" className="toc-link" style={tocLink}>
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

          {/* === About the data === */}
          <section id="about-data" style={sectionGroup}>
            <h3 style={h3Style}>About the data</h3>
            <p style={bodyText}>
              Relationship predictions are based on the Shared cM Project V4, a crowdsourced dataset of
              over 60,000 submissions mapping known relationships to observed cM values. This is the most
              widely used reference in genetic genealogy.
            </p>
            <p style={bodyText}>
              Segment data — including chromosome, start/end positions, and segment length in cM — comes
              from your DNA testing provider. The tool uses this data as-is to perform segment-level analysis
              and exclusion scoring.
            </p>
            <p style={bodyText}>
              Population baselines (the approximate cM shared by unrelated members of endogamous populations)
              are approximations drawn from genealogical literature and published IBD studies. They should be
              treated as guidance rather than exact thresholds.
            </p>
          </section>

          {/* === Glossary === */}
          <section id="glossary" style={sectionGroup}>
            <h3 style={h3Style}>Glossary</h3>
            <dl style={glossary} className="glossary-grid">
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
            <Link
              href="/"
              className="gl-btn gl-btn--primary"
            >
              Open the predictor
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style jsx global>{`
        .toc-link:hover {
          text-decoration: underline;
        }

        @media (max-width: 767px) {
          .help-page-container {
            padding: 16px 16px 60px !important;
          }
          .help-card {
            padding: 16px !important;
          }
          .toc-grid {
            grid-template-columns: 1fr !important;
          }
          .glossary-grid {
            grid-template-columns: 1fr !important;
          }
          .glossary-grid dt {
            padding-top: 8px !important;
            border-top: 1px solid rgba(201, 214, 228, 0.4);
          }
          .glossary-grid dd {
            padding-bottom: 4px;
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
