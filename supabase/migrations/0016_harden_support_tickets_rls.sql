-- Migration 0016: Harden support_tickets RLS policies
-- Restricts full access strictly to service_role, allows unauthenticated/authenticated users only to INSERT.

DROP POLICY IF EXISTS "Allow service role full access on support_tickets" ON public.support_tickets;

CREATE POLICY "Allow service role full access on support_tickets"
  ON public.support_tickets
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public insert on support_tickets"
  ON public.support_tickets
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
