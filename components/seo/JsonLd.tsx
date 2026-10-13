/**
 * Reusable schema.org JSON-LD injector. Renders a single
 * <script type="application/ld+json"> tag. Pass one object or an array of
 * objects (arrays are wrapped in an @graph under one @context).
 *
 * Added by the LIT Visibility Engine apply step (Phase 3).
 */
type JsonLdProps = {
  data: object | object[];
};

export function JsonLd({ data }: JsonLdProps) {
  const payload = Array.isArray(data)
    ? { "@context": "https://schema.org", "@graph": data }
    : { "@context": "https://schema.org", ...(data as Record<string, unknown>) };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(payload) }}
    />
  );
}

export default JsonLd;
