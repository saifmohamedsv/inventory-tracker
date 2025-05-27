export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Inventory Tracker",
  description:
    "A powerful inventory management system developed by Saif Mohamed. Track your inventory with ease using our intuitive web application. Perfect for businesses looking to streamline their stock management process.",
  author: {
    name: "Saif Mohamed",
    url: "https://saifmohamedsv.vercel.app",
    twitter: "@saifmohamed_swe",
  },
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
    portfolio: "https://saifmohamedsv.vercel.app",
    linkedin: "https://linkedin.com/in/saifmohamedsv",
  },
  keywords: [
    "inventory management",
    "stock tracking",
    "business tools",
    "Saif Mohamed",
    "inventory system",
    "stock management",
    "business software",
  ],
};
