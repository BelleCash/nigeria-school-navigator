   // =========================
    // SUPABASE CONFIG
    // =========================
    const SUPABASE_URL = "https://ulqsavnzjzvxqcihsmmv.supabase.co";
    const SUPABASE_ANON_KEY = "YOUR_ANON_KEY_HERE";

    const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // =========================
    // DOM ELEMENTS
    // =========================
    const form = document.getElementById("searchForm");
    const input = document.getElementById("searchInput");
    const stateFilter = document.getElementById("stateFilter");
    const lgaFilter = document.getElementById("lgaFilter");
    const typeFilter = document.getElementById("typeFilter");
    const settlementFilter = document.getElementById("settlementFilter");

    const resultsGrid = document.getElementById("resultsGrid");
    const resultCount = document.getElementById("resultCount");
    const emptyState = document.getElementById("emptyState");

    // =========================
    // LOAD STATES ON INIT
    // =========================
    async function loadStates() {
      const { data } = await client
        .from("schools")
        .select("state")
        .order("state");

      const uniqueStates = [...new Set(data.map(s => s.state))];

      uniqueStates.forEach(state => {
        const option = document.createElement("option");
        option.value = state;
        option.textContent = state;
        stateFilter.appendChild(option);
      });
    }

    loadStates();

    // =========================
    // SEARCH FUNCTION
    // =========================
    async function searchSchools() {

      let query = client.from("schools").select("*").limit(50);

      // search by name
      if (input.value) {
        query = query.ilike("name", `%${input.value}%`);
      }

      if (stateFilter.value) {
        query = query.eq("state", stateFilter.value);
      }

      if (lgaFilter.value) {
        query = query.eq("lga", lgaFilter.value);
      }

      if (typeFilter.value) {
        query = query.eq("level", typeFilter.value);
      }

      if (settlementFilter.value) {
        query = query.eq("settlement_type", settlementFilter.value);
      }

      const { data, error } = await query;

      if (error) {
        console.error(error);
        return;
      }

      renderResults(data);
    }

    // =========================
    // RENDER RESULTS
    // =========================
    function renderResults(data) {

      resultsGrid.innerHTML = "";

      resultCount.textContent = data.length;

      if (!data.length) {
        emptyState.classList.remove("hidden");
        return;
      }

      emptyState.classList.add("hidden");

      data.forEach(school => {

        const card = document.createElement("div");
        card.className = "school-card";

        card.innerHTML = `
          <h3>${school.name}</h3>
          <p>${school.state} • ${school.lga}</p>
          <p>Level: ${school.level}</p>
          <p>Type: ${school.settlement_type}</p>
          <small>Tags: ${(school.ai_tags || []).join(", ")}</small>
        `;

        resultsGrid.appendChild(card);
      });
    }

    // =========================
    // EVENTS
    // =========================
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      searchSchools();
    });

    // auto-search on change
    [stateFilter, lgaFilter, typeFilter, settlementFilter].forEach(el => {
      el.addEventListener("change", searchSchools);
    });
