export const categories = [
  {
    id: "diamond-blades",
    title: "Diamond Saw Blades",
    description: "Industrial grade diamond tools for concrete, granite, and masonry cutting.",
    image: "/assets/diamond_blade.png",
    products: [
      {
        id: "turbo-diamond-blade",
        title: "Turbo Diamond Blade",
        description: "High-speed cutting with clean finish. Ideal for hard materials.",
        applications: "Granite, Hard Tiles, Concrete, Marble",
        image: "/assets/diamond_blade.png",
        specs: [
          { label: "Bore", value: "22.23mm / 20mm" },
          { label: "Technology", value: "Hot Pressed / Sintered" },
          { label: "Wet/Dry", value: "Both" }
        ],
        tiers: {
          basic: {
            title: "Alpine Basic",
            color: "#00A896",
            desc: "Everyday retail use • Standard performance",
            sizes: ["4 inch (105mm)", "4.5 inch (115mm)", "5 inch (125mm)"]
          },
          plus: {
            title: "Alpine Plus",
            color: "#A8CC00",
            desc: "Professional workshop grade • Higher diamond concentration",
            sizes: ["4 inch (105mm)", "5 inch (125mm)", "7 inch (180mm)", "9 inch (230mm)"]
          },
          pro: {
            title: "Alpine Pro",
            color: "#00AACC",
            desc: "Extreme industrial performance • Laser welded segments",
            sizes: ["5 inch (125mm)", "7 inch (180mm)", "9 inch (230mm)", "12 inch (300mm)", "14 inch (350mm)"]
          }
        }
      },
      {
        id: "segmented-blade",
        title: "Segmented Diamond Blade",
        description: "Fast aggressive cutting for heavy construction materials.",
        applications: "Concrete, Brick, Block, Paving",
        image: "/assets/diamond_blade.png",
        specs: [
          { label: "Segment Height", value: "10mm - 15mm" },
          { label: "Bore", value: "22.23mm / 25.4mm" },
          { label: "Cooling", value: "Air-cooled slots" }
        ],
        tiers: {
          basic: {
            title: "Alpine Basic",
            color: "#00A896",
            desc: "General purpose masonry cutting",
            sizes: ["4 inch", "5 inch"]
          },
          plus: {
            title: "Alpine Plus",
            color: "#A8CC00",
            desc: "Reinforced concrete and cured concrete",
            sizes: ["4.5 inch", "7 inch", "9 inch", "12 inch"]
          },
          pro: {
            title: "Alpine Pro",
            color: "#00AACC",
            desc: "Heavy-duty road and bridge construction",
            sizes: ["14 inch", "16 inch", "18 inch"]
          }
        }
      }
    ]
  },
  {
    id: "tct-blades",
    title: "TCT Saw Blades",
    description: "Tungsten Carbide Tipped blades for wood, aluminum, and plastics.",
    image: "/assets/tct_blade.png",
    products: [
      {
        id: "woodmaster-tct",
        title: "WoodMaster TCT Blade",
        description: "Precision wood cutting with minimal splintering.",
        applications: "Softwood, Hardwood, Plywood, MDF",
        image: "/assets/tct_blade.png",
        specs: [
          { label: "Teeth Type", value: "ATB / TCG" },
          { label: "Carbide Grade", value: "C4 Premium" },
          { label: "Expansion Slots", value: "Laser Cut" }
        ],
        tiers: {
          basic: {
            title: "Alpine Basic",
            color: "#00A896",
            desc: "General timber and rough cuts",
            sizes: ["4\" 30T", "4\" 40T", "7\" 40T", "7\" 60T"]
          },
          plus: {
            title: "Alpine Plus",
            color: "#A8CC00",
            desc: "Fine finish and laminate cutting",
            sizes: ["4\" 40T", "7\" 60T", "10\" 80T", "12\" 100T"]
          },
          pro: {
            title: "Alpine Pro",
            color: "#00AACC",
            desc: "Industrial production and non-ferrous metals",
            sizes: ["10\" 100T", "12\" 120T", "14\" 120T"]
          }
        }
      }
    ]
  },
  {
    id: "cutting-discs",
    title: "Cutting & Grinding Discs",
    description: "Abrasive solutions for metal fabrication and stainless steel.",
    image: "/assets/cutting_disc.png",
    products: [
      {
        id: "metal-cutting-disc",
        title: "Metal Cutting Disc",
        description: "Thin profile for fast, clean cuts in steel and iron.",
        applications: "Mild Steel, Rebar, Iron, Cast Iron",
        image: "/assets/cutting_disc.png",
        specs: [
          { label: "Thickness", value: "1.0mm - 2.5mm" },
          { label: "Material", value: "Aluminum Oxide" },
          { label: "Bond", value: "Resinoid Reinforced" }
        ],
        tiers: {
          basic: {
            title: "Alpine Basic",
            color: "#00A896",
            desc: "General metal fabrication",
            sizes: ["4 inch", "5 inch"]
          },
          plus: {
            title: "Alpine Plus",
            color: "#A8CC00",
            desc: "Inox / Stainless steel grade",
            sizes: ["4 inch (Thin)", "5 inch", "7 inch", "14 inch (Chop Saw)"]
          },
          pro: {
            title: "Alpine Pro",
            color: "#00AACC",
            desc: "Extreme industrial grinding & fast cutting",
            sizes: ["7 inch (Heavy Duty)", "9 inch", "14 inch (Industrial)"]
          }
        }
      }
    ]
  }
];
