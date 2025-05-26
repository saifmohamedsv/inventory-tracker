export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Inventory Tracker",
  description:
    "Track your inventory with ease using our intuitive web application.",
  navItems: [{ href: "/", label: "" }],
  navMenuItems: [
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/saifmohamedsv",
    twitter: "https://twitter.com/saifmohamed_swe",
    discord: "https://discord.gg/5KN3ArRtXy",
  },
};
