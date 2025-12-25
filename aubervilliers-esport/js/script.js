(() => {
  const $ = (sel, root = document) => root.querySelector(sel);

  const form = $("#signupForm");
  const statusEl = $("#form-status");
  const overlay = $("#thanksOverlay");
  const closeOverlayBtn = $("#closeOverlayBtn");
  const yearEl = $("#year");

  const qrImg = $("#qrImg");
  const qrFallback = $("#qrFallback");

  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Fallback QR si l'image n'est pas dispo
  if (qrImg && qrFallback) {
    qrImg.addEventListener("error", () => {
      qrImg.hidden = true;
      qrFallback.hidden = false;
      qrFallback.setAttribute("aria-hidden", "false");
    });
  }

  const setStatus = (msg, kind = "") => {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.classList.remove("ok", "error");
    if (kind) statusEl.classList.add(kind);
  };

  const openOverlay = () => {
    if (!overlay) return;
    overlay.hidden = false;

    // Focus management minimal
    if (closeOverlayBtn) closeOverlayBtn.focus();
  };

  const closeOverlay = () => {
    if (!overlay) return;
    overlay.hidden = true;
  };

  const isProbablyEmail = (s) => /\S+@\S+\.\S+/.test(String(s || "").trim());
  const isProbablyPhone = (s) => /(\+?\d[\d\s().-]{7,})/.test(String(s || "").trim());
  const isProbablyContact = (value) => {
    const v = (value || "").trim();
    if (v.length < 5) return false;
    const hasEmail = /.+@.+\..+/.test(v);
    const digits = v.replace(/\D/g, "");
    const hasPhone = digits.length >= 10;
    return hasEmail || hasPhone;
  };

  const getLastSubmitTs = () => {
    try {
      return Number(localStorage.getItem("ae_last_submit_ts") || "0");
    } catch {
      return 0;
    }
  };

  const setLastSubmitTs = (ts) => {
    try {
      localStorage.setItem("ae_last_submit_ts", String(ts));
    } catch {
      // ignore
    }
  };

  const lockUI = (locked) => {
    const submitBtn = $("#submitBtn");
    if (!submitBtn) return;
    submitBtn.disabled = !!locked;
    submitBtn.setAttribute("aria-disabled", locked ? "true" : "false");
  };

  // Modal close handlers
  if (closeOverlayBtn) closeOverlayBtn.addEventListener("click", closeOverlay);
  if (overlay) {
    overlay.addEventListener("click", (e) => {
      const t = /** @type {HTMLElement} */ (e.target);
      if (t && t.dataset && t.dataset.close === "true") closeOverlay();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !overlay.hidden) closeOverlay();
    });
  }

  // CTA smooth scroll (si supporté)
  const cta = $("#ctaPreinscrire");
  if (cta) {
    cta.addEventListener("click", (e) => {
      const href = cta.getAttribute("href");
      if (!href || !href.startsWith("#")) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = target.querySelector("input,select,textarea,button");
      if (firstInput) firstInput.focus({ preventScroll: true });
    });
  }

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    setStatus("");

    // Anti-spam 1: honeypot
    const hp = form.querySelector('input[name="website"]');
    if (hp && String(hp.value || "").trim() !== "") {
      e.preventDefault();
      setStatus("Envoi bloqué (anti-spam).", "error");
      return;
    }

    // Validation HTML5 native
    if (!form.checkValidity()) {
      e.preventDefault();
      setStatus("Vérifie les champs obligatoires (et le consentement).", "error");
      form.reportValidity();
      return;
    }

    // Validation légère sur le contact
    const contact = form.querySelector("#contact");
    if (contact && !isProbablyContact(contact.value)) {
      e.preventDefault();
      setStatus("Ajoute un email valide ou un numéro (10 chiffres min).", "error");
      contact.focus();
      return;
    }

    // Anti-spam 2: throttle (30s)
    const now = Date.now();
    const last = getLastSubmitTs();
    const cooldownMs = 30_000;
    if (last && now - last < cooldownMs) {
      e.preventDefault();
      const sec = Math.ceil((cooldownMs - (now - last)) / 1000);
      setStatus(`Patiente ${sec}s avant de renvoyer.`, "error");
      return;
    }

    // Si endpoint pas remplacé, bloquer (sinon ça “réussit” côté UX mais rien n’arrive)
    const action = form.getAttribute("action") || "";
    if (action.includes("TON_ENDPOINT")) {
      e.preventDefault();
      setStatus("Remplace TON_ENDPOINT (Formspree) dans index.html (voir README).", "error");
      return;
    }

    // Enhancement: submit via fetch + overlay. Sans JS, le POST normal marche.
    e.preventDefault();

    const submitBtn = $("#submitBtn");
    if (submitBtn) submitBtn.disabled = true;

    setStatus("Envoi…", "");

    try {
      const formData = new FormData(form);

      const res = await fetch(action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });

      if (!res.ok) {
        setStatus("Oups — envoi impossible. Réessaie dans un instant.", "error");
        if (submitBtn) submitBtn.disabled = false;
        return;
      }

      setLastSubmitTs(Date.now());
      form.reset();
      setStatus("Merci ! On t'envoie toutes les infos par message.", "ok");
      openOverlay();
      if (submitBtn) submitBtn.disabled = false;
    } catch {
      setStatus("Erreur réseau. Vérifie ta connexion puis réessaie.", "error");
      if (submitBtn) submitBtn.disabled = false;
    }
  });
})();
