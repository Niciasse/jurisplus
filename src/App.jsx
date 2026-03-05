import { useState, useRef, useEffect } from "react";

// ============================================================
// JURIS+ — Plateforme Juridique & Administrative IA
// Côte d'Ivoire — Version Commerciale
// ============================================================

const MODULES = [
  {
    id: "consultation",
    icon: "⚖️",
    label: "Consultation",
    color: "#c9a84c",
    desc: "Questions juridiques & administratives",
    system: `Tu es un expert juridique et administratif ivoirien. Tu maîtrises parfaitement le droit ivoirien, le droit OHADA, le Code du travail ivoirien, le droit foncier, et les procédures administratives en Côte d'Ivoire.
Réponds de façon précise, professionnelle et structurée. Max 250 mots. Toujours en français.
Mentionne les textes légaux ivoiriens applicables quand c'est pertinent.
Termine par une recommandation pratique et une note de prudence.`,
    suggestions: [
      "Quelle est la procédure pour créer une SARL en Côte d'Ivoire ?",
      "Quels sont mes droits en cas de licenciement abusif selon le Code du travail CI ?",
      "Comment obtenir un titre foncier en Côte d'Ivoire ?",
      "Qu'est-ce qu'un marché public de gré à gré selon le Code des marchés CI ?",
    ],
  },
  {
    id: "courriers",
    icon: "✉️",
    label: "Courriers Admin",
    color: "#3b82f6",
    desc: "Préfecture · Mairie · Ministères",
    system: `Tu es expert en rédaction administrative ivoirienne. Tu rédiges des courriers officiels destinés aux administrations de Côte d'Ivoire (Préfectures, Sous-préfectures, Mairies, Ministères, CNPS, DGI, DGDD, etc.).
Respecte scrupuleusement les normes de rédaction administrative ivoirienne :
- En-tête avec références (Lieu, date, objet, PJ)
- Formule d'appel correcte selon le destinataire
- Corps structuré (exposé des faits, demande, justification)
- Formule de politesse adaptée au rang
- Signature
Sois formel, précis et complet. Adapte le registre selon le destinataire.`,
    suggestions: [
      "Une demande d'autorisation d'exercer une activité commerciale à la Mairie d'Abidjan",
      "Un recours gracieux au Préfet suite à un refus de permis de construire",
      "Une demande d'explication adressée à un employé (lettre officielle DRH)",
      "Une demande de subvention auprès du Ministère du Commerce",
    ],
  },
  {
    id: "ohada",
    icon: "🏢",
    label: "OHADA / RCCM",
    color: "#8b5cf6",
    desc: "Actes de commerce & sociétés",
    system: `Tu es un expert en droit des affaires OHADA et en droit commercial ivoirien. Tu rédiges et analyses des actes commerciaux, des statuts de sociétés, des contrats commerciaux conformes à l'Acte Uniforme OHADA.
Tu maîtrises : SARL, SA, SAS, SNC, GIE, procédures RCCM Abidjan, formalités CEPICI, ANRMP.
Rédige des documents complets, conformes et prêts à l'emploi. Précise les formalités d'enregistrement requises en CI.`,
    suggestions: [
      "Les statuts d'une SARL avec un capital de 1 000 000 FCFA entre deux associés",
      "Un contrat de distribution exclusive entre un fournisseur et un distributeur ivoirien",
      "Une clause de non-concurrence pour un contrat commercial OHADA",
      "Un procès-verbal d'assemblée générale ordinaire annuelle d'une SARL",
    ],
  },
  {
    id: "travail",
    icon: "👷",
    label: "Droit du Travail",
    color: "#10b981",
    desc: "Code du travail ivoirien",
    system: `Tu es un expert en droit du travail ivoirien. Tu maîtrises le Code du travail de Côte d'Ivoire, les conventions collectives, les procédures MEPS (Ministère de l'Emploi), CNPS, inspection du travail.
Tu rédiges : contrats de travail (CDI, CDD, temps partiel), lettres de licenciement, mises en demeure, règlements intérieurs, protocoles de fin de contrat, attestations de travail.
Assure-toi que tout document est conforme au Code du travail CI et aux dispositions CNPS. Indique les délais légaux et les montants dus (préavis, LICR, congés).`,
    suggestions: [
      "Un contrat de travail CDI pour un comptable, salaire 250 000 FCFA à Abidjan",
      "Une lettre de licenciement pour faute grave avec convocation préalable",
      "Un certificat de travail et une attestation de fin de contrat",
      "Un règlement intérieur pour une PME de 20 employés en Côte d'Ivoire",
    ],
  },
  {
    id: "foncier",
    icon: "🏗️",
    label: "Foncier & Immobilier",
    color: "#f59e0b",
    desc: "Titres fonciers · Baux · Ventes CI",
    system: `Tu es un expert en droit foncier et immobilier ivoirien. Tu maîtrises la loi de 1998 sur le domaine foncier rural, le régime des titres fonciers urbains, les procédures à la Conservation Foncière, les ACD (Attestation Coutumière de Détention).
Tu rédiges : contrats de vente immobilière, baux commerciaux et d'habitation, promesses de vente, conventions de démembrement, procès-verbaux de bornage.
Signale les risques juridiques et les vérifications obligatoires (état hypothécaire, certificat de propriété).`,
    suggestions: [
      "Un contrat de bail d'habitation à Abidjan, loyer 150 000 FCFA/mois, 1 an renouvelable",
      "Un compromis de vente d'un terrain avec titre foncier, prix 25 000 000 FCFA",
      "Un contrat de bail commercial pour un local à usage de bureau à Cocody",
      "Une convention de location-gérance d'un fonds de commerce à Adjamé",
    ],
  },
  {
    id: "marches",
    icon: "📊",
    label: "Marchés Publics",
    color: "#ef4444",
    desc: "Code des marchés · Budgets CI",
    system: `Tu es un expert en marchés publics et gestion budgétaire en Côte d'Ivoire. Tu maîtrises le Code des marchés publics ivoirien, les procédures ANRMP, la nomenclature budgétaire de l'État CI, la gestion des lignes budgétaires, les DAF, les ordonnancements.
Tu aides à : préparer des dossiers d'appel d'offres, rédiger des cahiers des charges, analyser des marchés, comprendre les procédures de passation (AOO, AOR, gré à gré, DRP), gérer les lignes budgétaires, rédiger des rapports de dépenses.
Référence les textes légaux ivoiriens applicables.`,
    suggestions: [
      "Comment préparer un dossier d'appel d'offres ouvert pour des fournitures de bureau ?",
      "Quelle est la procédure de passation d'un marché de gré à gré en CI ?",
      "Comment rédiger un cahier des charges pour des travaux de construction ?",
      "Expliquer la nomenclature budgétaire et la gestion des lignes en Côte d'Ivoire",
    ],
  },
  {
    id: "analyse",
    icon: "🔍",
    label: "Analyser Document",
    color: "#64748b",
    desc: "Audit de contrats & actes",
    system: `Tu es un auditeur juridique expert. Analyse le document ou contrat fourni et produis un rapport structuré :
1. 📋 NATURE DU DOCUMENT — Type, parties, objet
2. ✅ POINTS CONFORMES — Ce qui est légalement solide  
3. ⚠️ RISQUES IDENTIFIÉS — Clauses déséquilibrées, manques, ambiguïtés
4. 🔴 ALERTES CRITIQUES — Clauses nulles, illégales ou dangereuses
5. 💡 RECOMMANDATIONS — Corrections concrètes à apporter
Sois précis, cite les articles de loi ivoiriens ou OHADA applicables. Format professionnel de rapport.`,
    suggestions: [
      "CONTRAT DE BAIL — Art.8 : Le bailleur peut augmenter le loyer à tout moment sans préavis ni justification.",
      "CONTRAT DE TRAVAIL — Le salarié renonce à tout recours judiciaire en cas de litige avec l'employeur.",
      "CONTRAT DE VENTE — La propriété est transférée à la signature mais les risques restent à la charge du vendeur jusqu'au paiement intégral.",
      "MARCHÉ PUBLIC — Le prestataire supportera seul les pénalités de retard même en cas de force majeure prouvée.",
    ],
  },
];

const PLANS = [
  { name: "Starter", price: "5 000", period: "FCFA/mois", features: ["50 consultations/mois", "3 modules au choix", "Support par email"], color: "#64748b" },
  { name: "Pro", price: "15 000", period: "FCFA/mois", features: ["Consultations illimitées", "Tous les modules", "Téléchargement PDF", "Support prioritaire"], color: "#c9a84c", popular: true },
  { name: "Cabinet", price: "45 000", period: "FCFA/mois", features: ["5 utilisateurs", "Tous les modules", "Marque blanche", "Formation incluse", "Support dédié"], color: "#8b5cf6" },
];

export default function App() {
  const [page, setPage] = useState("app"); // app | tarifs | apropos
  const [module, setModule] = useState("consultation");
  const [messages, setMessages] = useState({});
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const mod = MODULES.find(m => m.id === module);
  const currentMessages = messages[module] || [];

  const sendMessage = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    setMessages(prev => ({ ...prev, [module]: [...(prev[module] || []), { role: "user", content: q }] }));
    setLoading(true);
    try {
      const hist = messages[module] || [];
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: mod.system,
          messages: [...hist.map(m => ({ role: m.role, content: m.content })), { role: "user", content: q }],
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Une erreur est survenue.";
      setMessages(prev => ({ ...prev, [module]: [...(prev[module] || []), { role: "assistant", content: reply }] }));
    } catch {
      setMessages(prev => ({ ...prev, [module]: [...(prev[module] || []), { role: "assistant", content: "Erreur de connexion." }] }));
    }
    setLoading(false);
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#f8f7f4", fontFamily: "'Segoe UI', system-ui, sans-serif", overflow: "hidden" }}>

      {/* ══ NAV ══ */}
      <nav style={{
        background: "#0a1628",
        borderBottom: "2px solid #c9a84c",
        padding: "0 24px",
        display: "flex", alignItems: "center",
        height: 58, flexShrink: 0, gap: 16, zIndex: 100,
      }}>
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => setPage("app")}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg, #c9a84c, #8a6e1f)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 900, color: "#fff",
          }}>J+</div>
          <div>
            <div style={{ color: "#f0e3b8", fontWeight: 800, fontSize: 16, letterSpacing: 0.5, lineHeight: 1 }}>JURIS<span style={{ color: "#c9a84c" }}>+</span></div>
            <div style={{ color: "#4a6080", fontSize: 9, letterSpacing: 2 }}>CÔTE D'IVOIRE</div>
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Nav links */}
        {["app", "tarifs", "apropos"].map(p => (
          <button key={p} onClick={() => setPage(p)} style={{
            background: "transparent", border: "none",
            color: page === p ? "#c9a84c" : "#4a6080",
            fontSize: 13, cursor: "pointer", fontWeight: page === p ? 700 : 400,
            padding: "4px 8px", fontFamily: "inherit",
            borderBottom: page === p ? "2px solid #c9a84c" : "2px solid transparent",
          }}>
            {p === "app" ? "Application" : p === "tarifs" ? "Tarifs" : "À propos"}
          </button>
        ))}

        <div style={{
          background: "#0f2a0f", border: "1px solid #1a5c1a",
          borderRadius: 20, padding: "3px 10px",
          fontSize: 10, color: "#4ade80",
          display: "flex", alignItems: "center", gap: 4,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
          EN LIGNE
        </div>
      </nav>

      {/* ══ PAGE : TARIFS ══ */}
      {page === "tarifs" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "40px 24px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div style={{ fontSize: 11, letterSpacing: 3, color: "#c9a84c", marginBottom: 8 }}>ABONNEMENTS</div>
              <h2 style={{ fontSize: 26, color: "#0a1628", margin: "0 0 8px" }}>Choisissez votre formule</h2>
              <p style={{ color: "#6b7280", fontSize: 14 }}>Paiement par Mobile Money · Orange Money · Wave · MTN</p>
            </div>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
              {PLANS.map(plan => (
                <div key={plan.name} style={{
                  flex: "1 1 220px", maxWidth: 260,
                  background: "#fff",
                  border: plan.popular ? `2px solid ${plan.color}` : "1px solid #e5e7eb",
                  borderRadius: 14,
                  padding: 24,
                  position: "relative",
                  boxShadow: plan.popular ? "0 8px 30px rgba(201,168,76,0.15)" : "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                  {plan.popular && (
                    <div style={{
                      position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                      background: plan.color, color: "#fff", fontSize: 10, fontWeight: 700,
                      padding: "3px 14px", borderRadius: 20, letterSpacing: 1,
                    }}>⭐ POPULAIRE</div>
                  )}
                  <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 4 }}>{plan.name}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: "#0a1628", lineHeight: 1 }}>
                    {plan.price} <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 400 }}>{plan.period}</span>
                  </div>
                  <div style={{ height: 1, background: "#f3f4f6", margin: "16px 0" }} />
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 8, marginBottom: 8, fontSize: 13, color: "#374151" }}>
                      <span style={{ color: plan.color, fontWeight: 700 }}>✓</span> {f}
                    </div>
                  ))}
                  <button onClick={() => setPage("app")} style={{
                    width: "100%", marginTop: 20, padding: "10px",
                    background: plan.popular ? `linear-gradient(135deg, ${plan.color}, #8a6e1f)` : "#f9fafb",
                    color: plan.popular ? "#fff" : "#374151",
                    border: plan.popular ? "none" : "1px solid #e5e7eb",
                    borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13,
                    fontFamily: "inherit",
                  }}>Commencer →</button>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 28, color: "#9ca3af", fontSize: 12 }}>
              💳 Paiement 100% sécurisé · Résiliation à tout moment · Facturation ivoirienne disponible
            </div>
          </div>
        </div>
      )}

      {/* ══ PAGE : À PROPOS ══ */}
      {page === "apropos" && (
        <div style={{ flex: 1, overflowY: "auto", padding: "40px 24px" }}>
          <div style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{
              background: "linear-gradient(135deg, #0a1628, #1a2d4a)",
              borderRadius: 16, padding: 32, marginBottom: 24, textAlign: "center",
              border: "1px solid #c9a84c33",
            }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>⚖️</div>
              <div style={{ color: "#c9a84c", fontSize: 11, letterSpacing: 3, marginBottom: 8 }}>PROPRIÉTAIRE & FONDATEUR</div>
              <div style={{ color: "#f0e3b8", fontSize: 22, fontWeight: 700, marginBottom: 6 }}>Juris+</div>
              <div style={{ color: "#8a9bb0", fontSize: 13, lineHeight: 1.7 }}>
                Plateforme d'intelligence artificielle juridique et administrative<br />
                dédiée à la Côte d'Ivoire et à l'espace OHADA
              </div>
              <div style={{
                marginTop: 16, display: "inline-block",
                background: "#c9a84c22", border: "1px solid #c9a84c44",
                borderRadius: 20, padding: "4px 16px",
                color: "#c9a84c", fontSize: 11, letterSpacing: 1,
              }}>🇨🇮 MADE IN CÔTE D'IVOIRE</div>
            </div>

            {[
              { icon: "🎯", titre: "Notre Mission", texte: "Rendre le droit accessible à tous les Ivoiriens — particuliers, entreprises et administrations — grâce à l'intelligence artificielle." },
              { icon: "🔒", titre: "Vos Données", texte: "Toutes vos consultations sont confidentielles. Vos données ne sont jamais partagées avec des tiers. Hébergement sécurisé." },
              { icon: "⚖️", titre: "Avertissement Légal", texte: "Juris+ est un outil d'aide à la décision. Il ne remplace pas un avocat ou un notaire agréé. Pour les affaires complexes, consultez un professionnel du droit." },
              { icon: "📞", titre: "Contact", texte: "Pour toute question, partenariat ou démonstration : contact@jurisplus.ci — WhatsApp disponible" },
            ].map(s => (
              <div key={s.titre} style={{
                background: "#fff", border: "1px solid #e5e7eb",
                borderRadius: 10, padding: 20, marginBottom: 12,
                display: "flex", gap: 14,
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontWeight: 700, color: "#0a1628", marginBottom: 4 }}>{s.titre}</div>
                  <div style={{ color: "#6b7280", fontSize: 13, lineHeight: 1.6 }}>{s.texte}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ PAGE : APPLICATION ══ */}
      {page === "app" && (
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Sidebar modules */}
          <div style={{
            width: 200, background: "#0a1628",
            borderRight: "1px solid #1a2d4a",
            display: "flex", flexDirection: "column",
            padding: "12px 0", flexShrink: 0, overflowY: "auto",
          }}>
            <div style={{ padding: "4px 14px 10px", fontSize: 9, color: "#2a4060", letterSpacing: 2 }}>MODULES</div>
            {MODULES.map(m => (
              <button key={m.id} onClick={() => setModule(m.id)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "10px 14px",
                background: module === m.id ? "#1a2d4a" : "transparent",
                borderLeft: module === m.id ? `3px solid ${m.color}` : "3px solid transparent",
                border: "none", cursor: "pointer",
                textAlign: "left", width: "100%",
                transition: "all 0.15s",
              }}>
                <span style={{ fontSize: 16, flexShrink: 0 }}>{m.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: module === m.id ? "#f0e3b8" : "#8a9bb0", lineHeight: 1.2 }}>{m.label}</div>
                  <div style={{ fontSize: 10, color: "#2a4060", lineHeight: 1.2 }}>{m.desc}</div>
                </div>
              </button>
            ))}

            <div style={{ flex: 1 }} />
            <div style={{ padding: "12px 14px", borderTop: "1px solid #1a2d4a" }}>
              <button onClick={() => setPage("tarifs")} style={{
                width: "100%", padding: "8px",
                background: "linear-gradient(135deg, #c9a84c, #8a6e1f)",
                border: "none", borderRadius: 8,
                color: "#fff", fontSize: 11, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}>⭐ Passer Pro</button>
            </div>
          </div>

          {/* Main chat area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

            {/* Module header */}
            <div style={{
              padding: "12px 20px",
              background: "#fff",
              borderBottom: "1px solid #e5e7eb",
              display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${mod.color}22`, border: `1px solid ${mod.color}44`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 18,
              }}>{mod.icon}</div>
              <div>
                <div style={{ fontWeight: 700, color: "#0a1628", fontSize: 14 }}>{mod.label}</div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>{mod.desc}</div>
              </div>
              <div style={{ flex: 1 }} />
              {currentMessages.length > 0 && (
                <button onClick={() => setMessages(prev => ({ ...prev, [module]: [] }))} style={{
                  padding: "5px 12px", background: "#f9fafb",
                  border: "1px solid #e5e7eb", borderRadius: 6,
                  fontSize: 11, color: "#9ca3af", cursor: "pointer",
                }}>Nouvelle conversation</button>
              )}
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>

              {currentMessages.length === 0 && (
                <div style={{ maxWidth: 600, margin: "16px auto", width: "100%" }}>
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{
                      width: 56, height: 56, borderRadius: 16, margin: "0 auto 10px",
                      background: `${mod.color}22`, border: `1px solid ${mod.color}44`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
                    }}>{mod.icon}</div>
                    <div style={{ fontWeight: 700, color: "#0a1628", fontSize: 16 }}>{mod.label}</div>
                    <div style={{ color: "#9ca3af", fontSize: 13 }}>Sélectionnez un exemple ou posez votre question</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {mod.suggestions.map((s, i) => (
                      <button key={i} onClick={() => sendMessage(s)} style={{
                        background: "#fff", border: "1px solid #e5e7eb",
                        borderLeft: `3px solid ${mod.color}`,
                        borderRadius: 8, padding: "10px 14px",
                        textAlign: "left", fontSize: 13, color: "#374151",
                        cursor: "pointer", fontFamily: "inherit", lineHeight: 1.5,
                        transition: "all 0.15s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"}
                        onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                      >{s.length > 80 ? s.substring(0, 78) + "…" : s}</button>
                    ))}
                  </div>
                </div>
              )}

              {currentMessages.map((m, i) => (
                <div key={i} style={{
                  display: "flex",
                  justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                  gap: 10, alignItems: "flex-start",
                  maxWidth: 780, margin: "0 auto", width: "100%",
                }}>
                  {m.role === "assistant" && (
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: "linear-gradient(135deg, #0a1628, #1a2d4a)",
                      border: `2px solid ${mod.color}`,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    }}>{mod.icon}</div>
                  )}
                  <div style={{
                    maxWidth: "78%",
                    background: m.role === "user" ? "linear-gradient(135deg, #0a1628, #1a2d4a)" : "#fff",
                    color: m.role === "user" ? "#f0e3b8" : "#1f2937",
                    borderRadius: m.role === "user" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                    padding: "12px 16px",
                    fontSize: 13.5, lineHeight: 1.75,
                    boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
                    border: m.role === "assistant" ? "1px solid #f3f4f6" : "none",
                    whiteSpace: "pre-wrap",
                  }}>{m.content}</div>
                  {m.role === "user" && (
                    <div style={{
                      width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                      background: mod.color,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    }}>👤</div>
                  )}
                </div>
              ))}

              {loading && (
                <div style={{ display: "flex", gap: 10, alignItems: "center", maxWidth: 780, margin: "0 auto", width: "100%" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: "linear-gradient(135deg, #0a1628, #1a2d4a)",
                    border: `2px solid ${mod.color}`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                  }}>{mod.icon}</div>
                  <div style={{
                    background: "#fff", border: "1px solid #f3f4f6",
                    borderRadius: "14px 14px 14px 3px", padding: "12px 16px",
                    display: "flex", gap: 5, alignItems: "center",
                  }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 7, height: 7, borderRadius: "50%",
                        background: mod.color,
                        animation: "bounce 1.2s ease-in-out infinite",
                        animationDelay: `${i * 0.2}s`,
                      }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div style={{ padding: "14px 20px", background: "#fff", borderTop: "1px solid #e5e7eb", flexShrink: 0 }}>
              <div style={{ maxWidth: 780, margin: "0 auto", display: "flex", gap: 10, alignItems: "flex-end" }}>
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder={`${mod.icon} ${mod.desc} — Écrivez votre demande...`}
                  rows={2}
                  style={{
                    flex: 1, padding: "11px 16px",
                    border: "1.5px solid #e5e7eb", borderRadius: 12,
                    fontSize: 13.5, fontFamily: "inherit", resize: "none",
                    outline: "none", color: "#1f2937", lineHeight: 1.5,
                    boxSizing: "border-box",
                  }}
                  onFocus={e => e.target.style.borderColor = mod.color}
                  onBlur={e => e.target.style.borderColor = "#e5e7eb"}
                />
                <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{
                  width: 44, height: 44, flexShrink: 0,
                  background: loading || !input.trim() ? "#f3f4f6" : `linear-gradient(135deg, ${mod.color}, #8a6e1f)`,
                  border: "none", borderRadius: 10,
                  color: loading || !input.trim() ? "#9ca3af" : "#fff",
                  cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                  fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center",
                }}>→</button>
              </div>
              <div style={{ textAlign: "center", fontSize: 10, color: "#d1d5db", marginTop: 6 }}>
                ⚖️ Juris+ · Outil d'aide juridique IA · Côte d'Ivoire · Consultez un professionnel pour les cas complexes
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce { 0%,100%{transform:translateY(0);opacity:.5} 50%{transform:translateY(-5px);opacity:1} }
        *{box-sizing:border-box}
        ::-webkit-scrollbar{width:4px}
        ::-webkit-scrollbar-thumb{background:#e5e7eb;border-radius:10px}
      `}</style>
    </div>
  );
}
