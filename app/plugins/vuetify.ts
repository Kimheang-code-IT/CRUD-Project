import { md3 } from "vuetify/blueprints";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    blueprint: md3,
    display: {
      mobileBreakpoint: "md",
    },
    icons: {
      defaultSet: "mdi", // Ensure MDI is default
      sets: {
        fa: {
          component: (props) => {
            return h("i", { class: `fa ${props.icon}` }); // Font Awesome icons
          },
        },
      },
    },
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          dark: false,
          colors: {
            primary: "#2A5A7F",
            secondary: "#F7D16A",
            accent: "#F7D16A",
            surface: "#FFFFFF",
            "on-primary": "#FFFFFF",
            "on-secondary": "#1D261A",
            "on-surface": "#333333",
            "on-accent": "#1D261A",
            background: "#FFFFFF",
            error: "#c62828",
            "on-error": "#FFFFFF",
            success: "#2A5A7F",
            "on-success": "#FFFFFF",
            warning: "#F7D16A",
            "on-warning": "#1D261A",
          },
        },
        dark: {
          dark: true,
          colors: {
            primary: "#3d7ba8",
            secondary: "#F7D16A",
            accent: "#F7D16A",
            surface: "#1e1e1e",
            "on-primary": "#FFFFFF",
            "on-secondary": "#1D261A",
            "on-surface": "#e0e0e0",
            "on-accent": "#1D261A",
            background: "#121212",
            error: "#cf6679",
            "on-error": "#000000",
            success: "#3d7ba8",
            "on-success": "#FFFFFF",
            warning: "#F7D16A",
            "on-warning": "#1D261A",
          },
        },
      },
    },
  });
  app.vueApp.use(vuetify);
});
