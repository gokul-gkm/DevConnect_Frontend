import { Appearance } from "@stripe/stripe-js";

export const darkStripeAppearance: Appearance = {
  theme: "night",

  variables: {
    // Core colors
    colorPrimary: "#a855f7", 
    colorBackground: "rgba(0,0,0,0)",
    colorText: "#e5e7eb",
    colorDanger: "#f87171",

    // Text
    fontFamily: "Inter, system-ui, sans-serif",
    fontSizeBase: "14px",

    // Shapes
    borderRadius: "14px",
    spacingUnit: "6px",

    // Remove Stripe tinting
    colorTextSecondary: "#9ca3af",
    colorTextPlaceholder: "#6b7280",
  },

  rules: {
    /* Root surface */
    ".Block": {
      backgroundColor: "rgba(0,0,0,0.55)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
    },

    /* Inputs */
    ".Input": {
      backgroundColor: "rgba(0,0,0,0.65)",
      border: "1px solid rgba(255,255,255,0.12)",
      color: "#e5e7eb",
    },

    ".Input::placeholder": {
      color: "#6b7280",
    },

    ".Input:focus": {
      borderColor: "#a855f7",
      boxShadow: "0 0 0 1px rgba(168,85,247,0.6)",
    },

    /* Labels */
    ".Label": {
      color: "#9ca3af",
      fontWeight: "500",
    },

    /* Errors */
    ".Error": {
      color: "#f87171",
    },

    /* Payment method tabs */
    ".Tab": {
      backgroundColor: "rgba(0,0,0,0.5)",
      border: "1px solid rgba(255,255,255,0.08)",
    },

    ".Tab:hover": {
      backgroundColor: "rgba(255,255,255,0.05)",
    },

    ".Tab--selected": {
      borderColor: "#a855f7",
      backgroundColor: "rgba(168,85,247,0.12)",
    },

    /* Accordion layout */
    ".AccordionItem": {
      backgroundColor: "rgba(0,0,0,0.45)",
      border: "1px solid rgba(255,255,255,0.08)",
    },

    ".AccordionItem--selected": {
      borderColor: "#a855f7",
      backgroundColor: "rgba(168,85,247,0.08)",
    },
  },
};
