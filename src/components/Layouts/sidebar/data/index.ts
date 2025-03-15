import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      // {
      //   title: "Dashboard",
      //   icon: Icons.HomeIcon,
      //   items: [
      //     {
      //       title: "eCommerce",
      //       url: "/",
      //     },
      //   ],
      // },
      // {
      //   title: "Calendar",
      //   url: "/calendar",
      //   icon: Icons.Calendar,
      //   items: [],
      // },
      // {
      //   title: "Profile",
      //   url: "/profile",
      //   icon: Icons.User,
      //   items: [],
      // },
      // {
      //   title: "Forms",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Form Elements",
      //       url: "/forms/form-elements",
      //     },
      //     {
      //       title: "Form Layout",
      //       url: "/forms/form-layout",
      //     },
      //   ],
      // },
      {
        title: "Users",
        url: "/users",
        icon: Icons.Table,
        items: [
          {
            title: "Users",
            url: "/users",
          },
        ],
      },
      {
        title: "Orders",
        url: "/orders",
        icon: Icons.Table,
        items: [
          {
            title: "Orders",
            url: "/orders",
          },
        ],
      },
      {
        title: "Products",
        url: "/products",
        icon: Icons.Table,
        items: [
          {
            title: "Products",
            url: "/products",
          },
        ],
      },
      // {
      //   title: "Pages",
      //   icon: Icons.Alphabet,
      //   items: [
      //     {
      //       title: "Settings",
      //       url: "/pages/settings",
      //     },
      //   ],
      // },
    ],
  }
];
