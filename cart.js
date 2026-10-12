/* ============================================
   PANIER — Thier Cosmetics
   Gardé dans le navigateur du client (localStorage).
   Rien n'est envoyé nulle part tant qu'il ne clique pas
   sur "Commander via WhatsApp".
   ============================================ */

const NUMERO_WHATSAPP = "221784411042"; // <-- votre numéro, sans + ni espaces

function lirePanier() {
  try { return JSON.parse(localStorage.getItem("thier_panier")) || []; }
  catch (e) { return []; }
}

function sauverPanier(panier) {
  localStorage.setItem("thier_panier", JSON.stringify(panier));
  majBadgePanier();
}

function ajouterAuPanier(id, quantite) {
  const panier = lirePanier();
  const existant = panier.find(l => l.id === id);
  if (existant) { existant.quantite += quantite; }
  else { panier.push({ id, quantite }); }
  sauverPanier(panier);
}

function changerQuantite(id, quantite) {
  let panier = lirePanier();
  if (quantite <= 0) { panier = panier.filter(l => l.id !== id); }
  else {
    const ligne = panier.find(l => l.id === id);
    if (ligne) ligne.quantite = quantite;
  }
  sauverPanier(panier);
}

function viderPanier() {
  localStorage.removeItem("thier_panier");
  majBadgePanier();
}

function nombreArticlesPanier() {
  return lirePanier().reduce((total, l) => total + l.quantite, 0);
}

function majBadgePanier() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const n = nombreArticlesPanier();
  badge.textContent = n;
  badge.style.display = n > 0 ? "flex" : "none";
}

function formaterPrix(n) {
  return n.toLocaleString("fr-FR") + " FCFA";
}

// Construit le message WhatsApp avec le récapitulatif de commande
function lienWhatsAppCommande() {
  const panier = lirePanier();
  if (panier.length === 0) return "https://wa.me/" + NUMERO_WHATSAPP;
  let texte = "Bonjour, je souhaite commander :%0A%0A";
  let total = 0;
  panier.forEach(l => {
    const p = PRODUITS.find(x => x.id === l.id);
    if (!p) return;
    const sousTotal = p.prix * l.quantite;
    total += sousTotal;
    texte += "- " + p.nom + " x" + l.quantite + " (" + formaterPrix(sousTotal) + ")%0A";
  });
  texte += "%0ATotal : " + formaterPrix(total);
  return "https://wa.me/" + NUMERO_WHATSAPP + "?text=" + texte;
}

document.addEventListener("DOMContentLoaded", majBadgePanier);
