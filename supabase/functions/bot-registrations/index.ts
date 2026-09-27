// ==============================================================================
// FRONTLINE CDL - SUPABASE EDGE FUNCTION: BOT REGISTRATIONS
// Endpoint: POST /functions/v1/bot-registrations (or /functions/v1/bot/registrations)
// Authenticated via FRONTLINE_BOT_SECRET or FRONTLINE_API_KEY
// ==============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-bot-api-key",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req: Request) => {
  // Handle CORS preflight for webhooks
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Enforce POST method
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed. Use POST.", code: "METHOD_NOT_ALLOWED" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    // 1. Authenticate Bot using pre-shared secret
    // Set this secret in Supabase Dashboard -> Project Settings -> Edge Functions -> Secrets
    const expectedSecret = Deno.env.get("FRONTLINE_BOT_SECRET") || Deno.env.get("FRONTLINE_API_KEY");
    
    const authHeader = req.headers.get("Authorization");
    const customKey = req.headers.get("x-bot-api-key");
    const providedSecret = authHeader ? authHeader.replace(/^Bearer\s+/i, "").trim() : (customKey ? customKey.trim() : null);

    if (expectedSecret && providedSecret !== expectedSecret) {
      return new Response(
        JSON.stringify({ 
          error: "Unauthorized: Invalid or missing bot API key.",
          code: "UNAUTHORIZED" 
        }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Parse and Validate Request Payload
    const body = await req.json();
    const {
      gamertag,
      discord_username,
      discord_user_id,
      activision_id = null,
      role = "Flex",
      platform = "PC",
      region = "NA East",
      registration_type = "Free Agent",
      status = "Pending",
      notes = null,
      team_name = null
    } = body;

    if (!gamertag || !discord_username || !discord_user_id) {
      return new Response(
        JSON.stringify({
          error: "Validation failed: 'gamertag', 'discord_username', and 'discord_user_id' are required.",
          code: "MISSING_REQUIRED_FIELDS",
          missing: [
            ...(!gamertag ? ["gamertag"] : []),
            ...(!discord_username ? ["discord_username"] : []),
            ...(!discord_user_id ? ["discord_user_id"] : [])
          ]
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Initialize Supabase Admin client with service_role privileges
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // 4. Insert into league_signups
    const { data, error } = await supabase
      .from("league_signups")
      .insert([
        {
          gamertag: String(gamertag).trim(),
          discord_username: String(discord_username).trim(),
          discord_user_id: String(discord_user_id).trim(),
          activision_id: activision_id ? String(activision_id).trim() : null,
          role: String(role).trim(),
          platform: String(platform).trim(),
          region: String(region).trim(),
          registration_type: String(registration_type).trim(),
          status: String(status).trim(),
          notes: notes ? String(notes).trim() : null,
          team_name: team_name ? String(team_name).trim() : null
        }
      ])
      .select()
      .single();

    if (error) {
      // Duplicate registration check (PostgreSQL error 23505 = unique_violation)
      if (error.code === "23505" || error.message.includes("unique") || error.message.includes("discord_user_id")) {
        return new Response(
          JSON.stringify({
            error: `Registration conflict: Discord user ID ${discord_user_id} is already registered in Frontline CDL.`,
            code: "DUPLICATE_REGISTRATION",
            discord_user_id: String(discord_user_id)
          }),
          { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      console.error("Database insert error:", error);
      return new Response(
        JSON.stringify({ error: error.message, code: error.code }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5. Success Response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Enlistment confirmed. Player registration logged in Frontline database.",
        registration: data
      }),
      { status: 201, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (err: any) {
    console.error("Unexpected handler exception:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
