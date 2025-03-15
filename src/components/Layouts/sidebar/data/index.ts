import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN MENU",
    items: [
      
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
        title: "Profile",
        icon: Icons.Alphabet,
        items: [
          {
            title: "Profile",
            url: "/profile",
          },
        ],
      },
    ],
  }
];
