import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

/**
 * Preset de tema para Activate Guajira.
 *
 * Estetica "deportivo energetico": base azul profundo (navy) con acento lima
 * de alto voltaje. Solo tema claro — ver el design system del proyecto en
 * .claude/skills/design-system-activate-guajira/SKILL.md
 *
 * Las escalas de aqui son la unica fuente de verdad del color: los tokens CSS
 * de styles.css referencian estos mismos valores.
 */
export const ActivateGuajiraPreset = definePreset(Aura, {
  primitive: {
    borderRadius: {
      none: '0',
      xs: '4px',
      sm: '6px',
      md: '10px',
      lg: '16px',
      xl: '24px',
    },
    navy: {
      50: '#F2F6FB',
      100: '#E1EAF5',
      200: '#C3D5EA',
      300: '#93AFD0',
      400: '#5C82B0',
      500: '#2F5A8F',
      600: '#1B3F6D',
      700: '#12305A',
      800: '#0B1F3A',
      900: '#071427',
      950: '#040B16',
    },
    lime: {
      50: '#F7FDE8',
      100: '#EDFAC7',
      200: '#DDF694',
      300: '#C6F24E',
      400: '#ADE02F',
      500: '#8FBF1E',
      600: '#6E9615',
      700: '#4F6B10',
      800: '#37490B',
      900: '#1F2906',
      950: '#0F1503',
    },
    coral: {
      50: '#FFF1EF',
      100: '#FFDED9',
      200: '#FFBDB4',
      300: '#FF8E7E',
      400: '#FF5A47',
      500: '#F03B26',
      600: '#D93A29',
      700: '#B02A1C',
      800: '#8A2317',
      900: '#5E1710',
      950: '#320B08',
    },
  },

  semantic: {
    primary: {
      50: '{navy.50}',
      100: '{navy.100}',
      200: '{navy.200}',
      300: '{navy.300}',
      400: '{navy.400}',
      500: '{navy.500}',
      600: '{navy.600}',
      700: '{navy.700}',
      800: '{navy.800}',
      900: '{navy.900}',
      950: '{navy.950}',
    },

    // Acento lima, disponible para los componentes que lo necesiten.
    accent: {
      50: '{lime.50}',
      100: '{lime.100}',
      200: '{lime.200}',
      300: '{lime.300}',
      400: '{lime.400}',
      500: '{lime.500}',
      600: '{lime.600}',
      700: '{lime.700}',
      800: '{lime.800}',
      900: '{lime.900}',
      950: '{lime.950}',
    },

    transitionDuration: '0.2s',

    focusRing: {
      width: '2px',
      style: 'solid',
      color: '{primary.500}',
      offset: '2px',
      shadow: '0 0 0 4px rgba(47, 90, 143, 0.16)',
    },

    formField: {
      paddingX: '0.875rem',
      paddingY: '0.6875rem',
      borderRadius: '{borderRadius.md}',
      focusRing: {
        width: '2px',
        style: 'solid',
        color: '{primary.500}',
        offset: '0',
        shadow: '0 0 0 4px rgba(47, 90, 143, 0.16)',
      },
    },

    content: {
      borderRadius: '{borderRadius.lg}',
    },

    overlay: {
      select: { borderRadius: '{borderRadius.md}' },
      popover: { borderRadius: '{borderRadius.lg}' },
      modal: { borderRadius: '{borderRadius.xl}', padding: '1.5rem' },
    },

    colorScheme: {
      light: {
        primary: {
          color: '{navy.800}',
          contrastColor: '#ffffff',
          hoverColor: '{navy.700}',
          activeColor: '{navy.900}',
        },
        highlight: {
          background: '{navy.50}',
          focusBackground: '{navy.100}',
          color: '{navy.800}',
          focusColor: '{navy.900}',
        },
        surface: {
          0: '#ffffff',
          50: '#F7F9FC',
          100: '#EFF3F8',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        text: {
          color: '{surface.900}',
          hoverColor: '{surface.950}',
          mutedColor: '{surface.500}',
          hoverMutedColor: '{surface.600}',
        },
        content: {
          background: '#ffffff',
          borderColor: '{surface.200}',
        },
        formField: {
          background: '#ffffff',
          disabledBackground: '{surface.100}',
          filledBackground: '{surface.50}',
          borderColor: '{surface.300}',
          hoverBorderColor: '{navy.400}',
          focusBorderColor: '{navy.500}',
          invalidBorderColor: '#DC2626',
          color: '{surface.900}',
          placeholderColor: '{surface.400}',
          floatLabelColor: '{surface.500}',
        },
      },
    },
  },

  components: {
    button: {
      root: {
        borderRadius: '{borderRadius.md}',
        paddingX: '1.125rem',
        paddingY: '0.625rem',
        gap: '0.5rem',
        label: { fontWeight: '600' },
      },
      colorScheme: {
        light: {
          root: {
            primary: {
              background: '{navy.800}',
              hoverBackground: '{navy.700}',
              activeBackground: '{navy.900}',
              borderColor: '{navy.800}',
              hoverBorderColor: '{navy.700}',
              activeBorderColor: '{navy.900}',
              color: '#ffffff',
              hoverColor: '#ffffff',
              activeColor: '#ffffff',
            },
          },
        },
      },
    },
    card: {
      root: {
        borderRadius: '{borderRadius.lg}',
        shadow: '0 1px 2px rgba(11, 31, 58, 0.06), 0 4px 12px rgba(11, 31, 58, 0.05)',
      },
      body: { padding: '1.5rem', gap: '1rem' },
      title: { fontWeight: '700', fontSize: '1.25rem' },
    },
    datatable: {
      header: { background: '{surface.50}', borderColor: '{surface.200}' },
      headerCell: {
        background: '{surface.50}',
        hoverBackground: '{surface.100}',
        color: '{surface.600}',
        borderColor: '{surface.200}',
        padding: '0.875rem 1rem',
      },
      bodyCell: { borderColor: '{surface.200}', padding: '0.875rem 1rem' },
      row: { hoverBackground: '{navy.50}' },
    },
    dialog: {
      root: {
        borderRadius: '{borderRadius.xl}',
        shadow: '0 24px 64px rgba(11, 31, 58, 0.22)',
      },
      header: { padding: '1.5rem 1.5rem 0.75rem 1.5rem' },
      content: { padding: '0 1.5rem 1.5rem 1.5rem' },
      footer: { padding: '0 1.5rem 1.5rem 1.5rem', gap: '0.75rem' },
      title: { fontSize: '1.25rem', fontWeight: '700' },
    },
    toast: {
      root: { borderRadius: '{borderRadius.lg}', borderWidth: '0 0 0 5px' },
      content: { padding: '1rem' },
    },
    tag: {
      root: { borderRadius: '{borderRadius.full}', fontWeight: '600' },
    },
    progressbar: {
      root: { borderRadius: '{borderRadius.full}', height: '0.5rem' },
      value: { background: '{navy.800}' },
    },
    menu: {
      root: { borderRadius: '{borderRadius.lg}' },
      item: { borderRadius: '{borderRadius.sm}' },
    },
  },
});
