// ==============================================================================
// FRONTLINE CALL OF DUTY LEAGUE - RAILWAY POSTGRESQL CLIENT ADAPTER
// ==============================================================================
// Drop-in compatible replacement for @supabase/supabase-js
// Routes all database queries seamlessly to the Node.js backend
// ==============================================================================

(function() {
  function createRailwayClient() {
    return {
      from(table) {
        let queryParams = {};
        let filters = [];
        let orderBy = [];
        let limitCount = null;
        let isSingle = false;
        let isMaybeSingle = false;

        const builder = {
          select(cols = "*") {
            queryParams.select = cols;
            return builder;
          },
          eq(col, val) {
            filters.push({ col, op: "eq", val });
            return builder;
          },
          neq(col, val) {
            filters.push({ col, op: "neq", val });
            return builder;
          },
          gte(col, val) {
            filters.push({ col, op: "gte", val });
            return builder;
          },
          lte(col, val) {
            filters.push({ col, op: "lte", val });
            return builder;
          },
          in(col, vals) {
            filters.push({ col, op: "in", val: vals });
            return builder;
          },
          order(col, opts = { ascending: true }) {
            orderBy.push({ col, ascending: opts && opts.ascending !== false });
            return builder;
          },
          limit(n) {
            limitCount = n;
            return builder;
          },
          single() {
            isSingle = true;
            return builder;
          },
          maybeSingle() {
            isMaybeSingle = true;
            return builder;
          },

          // Promise execution (await dbClient.from(...).select(...))
          async then(resolve, reject) {
            try {
              const url = "/api/data/" + encodeURIComponent(table) + "?q=" + encodeURIComponent(
                JSON.stringify({ filters, orderBy, limit: limitCount })
              );
              const res = await fetch(url);
              const json = await res.json();
              if (json.error) {
                return resolve({ data: null, error: json.error });
              }
              let data = json.data;
              if (isSingle) {
                data = Array.isArray(data) ? (data[0] || null) : data;
              } else if (isMaybeSingle) {
                data = Array.isArray(data) ? (data[0] || null) : data;
              }
              return resolve({ data, error: null });
            } catch (err) {
              console.warn(`Railway query error on ${table}:`, err);
              return resolve({ data: null, error: err });
            }
          },

          async insert(payload) {
            try {
              const res = await fetch("/api/data/" + encodeURIComponent(table), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              });
              const json = await res.json();
              return {
                data: json.data,
                error: json.error || null,
                select() { return Promise.resolve({ data: json.data, error: json.error || null }); }
              };
            } catch (err) {
              return { data: null, error: err, select() { return Promise.resolve({ data: null, error: err }); } };
            }
          },

          async upsert(payload) {
            try {
              const res = await fetch("/api/data/" + encodeURIComponent(table) + "/upsert", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
              });
              const json = await res.json();
              return {
                data: json.data,
                error: json.error || null,
                select() { return Promise.resolve({ data: json.data, error: json.error || null }); }
              };
            } catch (err) {
              return { data: null, error: err, select() { return Promise.resolve({ data: null, error: err }); } };
            }
          },

          update(payload) {
            const updateFilters = [...filters];
            const updateBuilder = {
              eq(col, val) {
                updateFilters.push({ col, op: "eq", val });
                return updateBuilder;
              },
              async then(resolve) {
                try {
                  const res = await fetch("/api/data/" + encodeURIComponent(table), {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ updates: payload, filters: updateFilters })
                  });
                  const json = await res.json();
                  return resolve({ data: json.data, error: json.error || null });
                } catch (err) {
                  return resolve({ data: null, error: err });
                }
              }
            };
            return updateBuilder;
          },

          delete() {
            const deleteFilters = [...filters];
            const deleteBuilder = {
              eq(col, val) {
                deleteFilters.push({ col, op: "eq", val });
                return deleteBuilder;
              },
              gte(col, val) {
                deleteFilters.push({ col, op: "gte", val });
                return deleteBuilder;
              },
              in(col, vals) {
                deleteFilters.push({ col, op: "in", val: vals });
                return deleteBuilder;
              },
              async then(resolve) {
                try {
                  const res = await fetch("/api/data/" + encodeURIComponent(table), {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ filters: deleteFilters })
                  });
                  const json = await res.json();
                  return resolve({ data: json.data, error: json.error || null });
                } catch (err) {
                  return resolve({ data: null, error: err });
                }
              }
            };
            return deleteBuilder;
          }
        };
        return builder;
      },

      auth: {
        async getSession() {
          const userStr = localStorage.getItem("frontline_arena_auth_user");
          const user = userStr ? JSON.parse(userStr) : null;
          return { data: { session: user ? { user } : null }, error: null };
        },
        async getUser() {
          const userStr = localStorage.getItem("frontline_arena_auth_user");
          const user = userStr ? JSON.parse(userStr) : null;
          return { data: { user }, error: null };
        },
        async signInWithPassword({ email, password }) {
          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password })
            });
            const json = await res.json();
            if (json.user) {
              localStorage.setItem("frontline_arena_auth_user", JSON.stringify(json.user));
              return { data: { user: json.user, session: { user: json.user } }, error: null };
            }
            return { data: { user: null, session: null }, error: json.error || "Login failed" };
          } catch (err) {
            return { data: null, error: err.message };
          }
        },
        async signUp({ email, password, options }) {
          const user = {
            id: "usr_" + Date.now(),
            email: email,
            user_metadata: (options && options.data) || {}
          };
          localStorage.setItem("frontline_arena_auth_user", JSON.stringify(user));
          return { data: { user, session: { user } }, error: null };
        },
        async signOut() {
          localStorage.removeItem("frontline_arena_auth_user");
          return { error: null };
        },
        async updateUser(updates) {
          try {
            let user = JSON.parse(localStorage.getItem("frontline_arena_auth_user") || "{}");
            Object.assign(user, updates);
            localStorage.setItem("frontline_arena_auth_user", JSON.stringify(user));
            return { data: { user }, error: null };
          } catch (err) {
            return { data: null, error: err };
          }
        }
      }
    };
  }

  window.createRailwayClient = createRailwayClient;
})();
