import { supabase } from "@lystes/integrations/supabase/client";

/**
 * Les modèles de messages d'une organisation.
 *
 * L'écran Notifications lit `cc_notification_templates`, et son hook ne sait
 * faire qu'un `UPDATE`, jamais un `INSERT` : sans amorçage, il est vide à vie.
 * Un marchand qui veut modifier le texte de sa confirmation ne trouve rien à
 * modifier. Constaté et corrigé le 12/08/2026.
 *
 * Cinq moments, deux canaux. Les textes sont écrits pour être lus par un
 * client, pas par un développeur : pas de jargon, pas d'anglais, et les
 * variables sont nommées en français pour que le marchand comprenne ce qu'il
 * déplace quand il les réécrit.
 *
 * Idempotent : on n'écrit que les modèles manquants, jamais par-dessus ceux que
 * le marchand a personnalisés.
 */

interface Modele {
  type: string;
  channel: "email" | "sms";
  subject: string | null;
  body: string;
}

/** `{{boutique}}`, `{{client}}`, `{{prestation}}`, `{{date}}`, `{{heure}}`. */
const MODELES: Modele[] = [
  {
    type: "confirmation",
    channel: "email",
    subject: "Votre rendez-vous du {{date}} est confirmé",
    body:
      "Bonjour {{client}},\n\n" +
      "Votre rendez-vous chez {{boutique}} est confirmé.\n\n" +
      "Prestation : {{prestation}}\n" +
      "Quand : {{date}} à {{heure}}\n\n" +
      "À très bientôt,\n{{boutique}}",
  },
  {
    type: "confirmation",
    channel: "sms",
    subject: null,
    body: "{{boutique}} : votre rendez-vous du {{date}} à {{heure}} est confirmé. {{prestation}}.",
  },
  {
    type: "rappel_veille",
    channel: "email",
    subject: "Votre rendez-vous, c'est demain",
    body:
      "Bonjour {{client}},\n\n" +
      "Petit rappel : votre rendez-vous chez {{boutique}} a lieu demain, {{date}} à {{heure}}.\n\n" +
      "Prestation : {{prestation}}\n\n" +
      "Un empêchement ? Prévenez-nous au plus tôt, nous proposerons ce créneau à quelqu'un d'autre.",
  },
  {
    type: "rappel_veille",
    channel: "sms",
    subject: null,
    body: "Rappel {{boutique}} : demain {{date}} à {{heure}}, {{prestation}}. Un empêchement ? Répondez à ce message.",
  },
  {
    type: "rappel_heure",
    channel: "email",
    subject: "Votre rendez-vous dans une heure",
    body:
      "Bonjour {{client}},\n\n" +
      "Votre rendez-vous chez {{boutique}} a lieu dans une heure, à {{heure}}.\n\n" +
      "À tout de suite.",
  },
  {
    type: "rappel_heure",
    channel: "sms",
    subject: null,
    body: "{{boutique}} : votre rendez-vous est dans une heure, à {{heure}}. À tout de suite.",
  },
  {
    type: "annulation",
    channel: "email",
    subject: "Votre rendez-vous du {{date}} est annulé",
    body:
      "Bonjour {{client}},\n\n" +
      "Votre rendez-vous du {{date}} à {{heure}} chez {{boutique}} a été annulé.\n\n" +
      "Vous pouvez en reprendre un quand vous le souhaitez.\n\n" +
      "{{boutique}}",
  },
  {
    type: "annulation",
    channel: "sms",
    subject: null,
    body: "{{boutique}} : votre rendez-vous du {{date}} à {{heure}} est annulé. Vous pouvez en reprendre un quand vous voulez.",
  },
  {
    type: "report",
    channel: "email",
    subject: "Votre rendez-vous a été déplacé",
    body:
      "Bonjour {{client}},\n\n" +
      "Votre rendez-vous chez {{boutique}} a été déplacé au {{date}} à {{heure}}.\n\n" +
      "Prestation : {{prestation}}\n\n" +
      "Si ce nouveau créneau ne vous convient pas, dites-le-nous.",
  },
  {
    type: "report",
    channel: "sms",
    subject: null,
    body: "{{boutique}} : votre rendez-vous est déplacé au {{date}} à {{heure}}. Si ça ne convient pas, dites-le-nous.",
  },
];

/**
 * Pose les modèles manquants pour cette organisation. Ne lève jamais : un
 * écran de réglages vide vaut mieux qu'un module qui refuse de s'ouvrir.
 */
export async function assurerModelesMessages(orgId: string | null | undefined): Promise<number> {
  if (!orgId) return 0;

  const { data: existants, error } = await supabase
    .from("cc_notification_templates")
    .select("type, channel")
    .eq("org_id", orgId);

  if (error) {
    console.error("[booking][modeles] lecture impossible :", error.message);
    return 0;
  }

  const dejaLa = new Set((existants ?? []).map((m) => `${m.type}:${m.channel}`));
  const aPoser = MODELES.filter((m) => !dejaLa.has(`${m.type}:${m.channel}`));
  if (aPoser.length === 0) return 0;

  const { error: erreurEcriture } = await supabase
    .from("cc_notification_templates")
    .insert(aPoser.map((m) => ({ ...m, org_id: orgId, is_active: true })) as never);

  if (erreurEcriture) {
    console.error("[booking][modeles] écriture impossible :", erreurEcriture.message);
    return 0;
  }

  return aPoser.length;
}
