import { useState, useMemo } from "react";
import { useUser } from "@/context/user-context";
import { toast } from "sonner";
import {
  Search,
  ExternalLink,
  Star,
  Check,
  ArrowUpDown,
  X,
  ChevronRight,
  Info,
  Building2,
  Tag,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/componentss/ui/button";
import { Input } from "@/componentss/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/componentss/ui/card";
import { Badge } from "@/componentss/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/componentss/ui/dialog";
import { Separator } from "@/componentss/ui/separator";

// Custom SVG Icons for each product to keep the shop looking premium and custom-tailored
const SyringeIcon = () => (
  <svg className="w-full h-full text-sky-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m18 2 4 4" />
    <path d="m17 7 3-3" />
    <path d="M19 9 8.7 19.3a1 1 0 0 1-.7.3H5v-3a1 1 0 0 1 .3-.7L15.6 5.4" />
    <path d="m9 11 4 4" />
    <path d="m5 19-3 3" />
    <path d="m14 8 2 2" />
  </svg>
);

const WheelchairIcon = () => (
  <svg className="w-full h-full text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="18" r="4" />
    <circle cx="19" cy="8" r="2" />
    <path d="M9 14h6.5l2.5 5.5" />
    <path d="m12.5 7.5 2.5 3h4.5" />
    <path d="M9 6v8" />
  </svg>
);

const StethoscopeIcon = () => (
  <svg className="w-full h-full text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5C3.67 16.5 3 15.83 3 15V9c0-1.66 1.34-3 3-3h12c1.66 0 3 1.34 3 3v6c0 .83-.67 1.5-1.5 1.5S18 15.83 18 15v-3c0-1.1-.9-2-2-2H8c-1.1 0-2 .9-2 2v3c0 .83-.67 1.5-1.5 1.5z" />
    <path d="M12 10v6" />
    <path d="M12 16c0 2.2 1.8 4 4 4h1.5" />
    <circle cx="19.5" cy="20" r="1.5" />
  </svg>
);

const BPMonitorIcon = () => (
  <svg className="w-full h-full text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="12" rx="2" />
    <path d="M7 7h4v4H7z" />
    <path d="M15 9h2" />
    <path d="M15 6h2" />
    <path d="M2 18h16a2 2 0 0 1 2 2v1H0v-1a2 2 0 0 1 2-2z" />
    <path d="M6 15v3" />
  </svg>
);

const MaskIcon = () => (
  <svg className="w-full h-full text-teal-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0-3.3-2.7-6-6-6H9C5.7 4 3 6.7 3 10v4c0 3.3 2.7 6 6 6h6c3.3 0 6-2.7 6-6v-4z" />
    <path d="M3 10c4.5 1 13.5 1 18 0" />
    <path d="M3 14c4.5-1 13.5-1 18 0" />
    <path d="M9 4v16" />
    <path d="M15 4v16" />
  </svg>
);

const IVStandIcon = () => (
  <svg className="w-full h-full text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2v20" />
    <path d="M8 5c1.5-1 2.5-2 4-2s2.5 1 4 2" />
    <path d="M12 5V2" />
    <path d="M9 22h6" />
    <path d="M6 22h2" />
    <path d="M16 22h2" />
  </svg>
);

const GlovesIcon = () => (
  <svg className="w-full h-full text-cyan-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2" />
    <path d="M6 10h4" />
    <path d="M6 14h8" />
    <circle cx="18" cy="12" r="2" fill="currentColor" fillOpacity="0.2" />
  </svg>
);

const ThermometerIcon = () => (
  <svg className="w-full h-full text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" />
    <path d="M12 9h.01" />
    <path d="M12 11h.01" />
    <path d="M12 7h.01" />
    <path d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
  </svg>
);

interface Product {
  id: string;
  name: string;
  category: "Equipment" | "Disposables" | "Diagnostics";
  price: number;
  stock: number;
  rating: number;
  description: string;
  specs: string[];
  manufacturer: string;
  icon: () => JSX.Element;
  tags: string[];
  externalUrl: string;
}

const PRODUCTS_DATA: Product[] = [
  {
    id: "prod-001",
    name: "Ergonomic Active Wheelchair",
    category: "Equipment",
    price: 249.99,
    stock: 14,
    rating: 4.9,
    description: "Lightweight, folding active wheelchair designed for patient transit and independent mobility. Built with high-strength aluminum alloy, memory foam seating, and heavy-duty, puncture-resistant rubber tires.",
    specs: [
      "Frame Material: High-strength aircraft grade aluminum",
      "Weight Capacity: 150 kg (330 lbs)",
      "Folded Width: 32 cm",
      "Padded dual-armrests and swing-away footrests",
      "Seat Size: 45cm x 42cm (W x D)"
    ],
    manufacturer: "Biomed Mobility Corp",
    icon: WheelchairIcon,
    tags: ["Mobility", "Ward Care", "Patient Transit"],
    externalUrl: "https://example.com/shop/active-wheelchair"
  },
  {
    id: "prod-002",
    name: "Medical Grade Syringes (Box of 100)",
    category: "Disposables",
    price: 18.50,
    stock: 142,
    rating: 4.7,
    description: "Sterile, single-use 3mL syringe with attached 23G x 1\" ultra-thin wall needle. Features a highly transparent barrel with bold, easy-to-read graduation scale and a positive plunger stop to prevent accidental spillage.",
    specs: [
      "Capacity: 3 mL (cc)",
      "Needle Size: 23G x 1 inch",
      "Connection: Luer-lock tip safety connection",
      "Sterility: Ethylene Oxide (EO) gas sterilized",
      "Non-toxic, pyrogen-free, latex-free"
    ],
    manufacturer: "PrecisionMed Solutions",
    icon: SyringeIcon,
    tags: ["Injection", "Sterile", "Single-Use"],
    externalUrl: "https://example.com/shop/needles-and-syringes"
  },
  {
    id: "prod-003",
    name: "Cardiology Stethoscope Pro",
    category: "Diagnostics",
    price: 95.00,
    stock: 28,
    rating: 4.9,
    description: "State-of-the-art diagnostic stethoscope featuring high acoustic sensitivity. Equipped with double-sided stainless steel chestpiece, tunable diaphragms, and anatomically aligned headset with soft-sealing eartips.",
    specs: [
      "Chestpiece Material: Machined stainless steel",
      "Tubing Design: Dual-lumen, high resilience latex-free",
      "Acoustic Sensitivity: 10/10 level rating",
      "Headset: Adjustable tension, anatomical angle",
      "Includes extra soft-sealing ear tips & non-chill sleeve"
    ],
    manufacturer: "AcoustiPhy Instruments",
    icon: StethoscopeIcon,
    tags: ["Acoustics", "Cardio", "General Exam"],
    externalUrl: "https://example.com/shop/stethoscope-pro"
  },
  {
    id: "prod-004",
    name: "Wireless Digital BP Monitor",
    category: "Diagnostics",
    price: 59.99,
    stock: 37,
    rating: 4.6,
    description: "Fully automatic, upper arm blood pressure monitor. Provides instant systolic, diastolic, and pulse rate readings. Features irregular heartbeat detector, double-user tracking (99 records each), and Bluetooth syncing to clinic logs.",
    specs: [
      "Measurement Site: Upper Arm",
      "Cuff Circumference: 22 cm to 42 cm",
      "Display: 4.5\" High-contrast backlit LCD",
      "Power Source: 4 AAA Batteries or USB-C direct feed",
      "Bluetooth compatibility with iOS and Android devices"
    ],
    manufacturer: "OmniHealth Diagnostics",
    icon: BPMonitorIcon,
    tags: ["Vitals", "Heart Care", "Electronic"],
    externalUrl: "https://example.com/shop/blood-pressure-monitor"
  },
  {
    id: "prod-005",
    name: "N95 Surgical Respirators (Box of 50)",
    category: "Disposables",
    price: 34.99,
    stock: 85,
    rating: 4.8,
    description: "NIOSH-approved N95 particulate respirator mask. Engineered with 5 layers of melt-blown electrostatic filtration to block at least 95% of airborne particulates. Highly fluid-resistant with soft foam nose cushion and adjustable nose clip.",
    specs: [
      "Filtration Rating: NIOSH N95 Certified",
      "Fluid Resistance: 160 mmHg (ASTM F1862)",
      "Style: Cup shape with dual secure headbands",
      "Melt-blown polypropylene filter media",
      "Individually wrapped sterile pieces"
    ],
    manufacturer: "GuardianCare Supplies",
    icon: MaskIcon,
    tags: ["PPE", "Respiratory", "Infection Control"],
    externalUrl: "https://example.com/shop/n95-masks"
  },
  {
    id: "prod-006",
    name: "Mobile IV Infusion Stand (4 Hooks)",
    category: "Equipment",
    price: 89.00,
    stock: 12,
    rating: 4.5,
    description: "Stainless steel intravenous poles with an adjustable height locking system. Designed with five smooth-rolling swivel caster wheels on a weighted star base to ensure patient stability and ease of movement around the clinic.",
    specs: [
      "Material: Heavy-duty SUS304 Stainless Steel",
      "Height Range: 120 cm to 210 cm adjustable",
      "Hook Count: 4 detachable stainless hooks",
      "Base: 5-wheel weighted star base (anti-tip)",
      "Casters: Two locking casters, three free-rolling"
    ],
    manufacturer: "Biomed Mobility Corp",
    icon: IVStandIcon,
    tags: ["Infusion", "Patient Ward", "Mobile"],
    externalUrl: "https://example.com/shop/iv-stands"
  },
  {
    id: "prod-007",
    name: "Sterile Nitrile Gloves (Box of 100)",
    category: "Disposables",
    price: 14.99,
    stock: 210,
    rating: 4.8,
    description: "High-grade powder-free nitrile examination gloves. Offers exceptional strength, elasticity, and chemical resistance. Features micro-textured fingertips for excellent wet and dry grip. Ambidextrous and latex-free.",
    specs: [
      "Material: 100% Synthetic Nitrile Rubber",
      "Thickness: 4.5 mil (palm), 5.0 mil (fingers)",
      "Finish: Micro-textured fingertips",
      "Powder-free, latex-free, DEHP-free",
      "AQL rating: 1.5 exam grade standard"
    ],
    manufacturer: "PrecisionMed Solutions",
    icon: GlovesIcon,
    tags: ["PPE", "Barrier", "Examination"],
    externalUrl: "https://example.com/shop/nitrile-gloves"
  },
  {
    id: "prod-008",
    name: "Infrared Forehead Thermometer",
    category: "Diagnostics",
    price: 29.99,
    stock: 64,
    rating: 4.7,
    description: "High-precision non-contact infrared thermometer. Obtains clinical-grade temperature readings in under 1 second without patient contact. Equipped with a triple-color fever alert backlit display and sound toggles.",
    specs: [
      "Measurement Distance: 1 cm to 5 cm",
      "Response Time: 0.8 seconds",
      "Memory Storage: 32 individual temperature logs",
      "Alert System: Green (Normal), Yellow (Low Fever), Red (High Fever)",
      "Auto-off feature after 15 seconds of inactivity"
    ],
    manufacturer: "OmniHealth Diagnostics",
    icon: ThermometerIcon,
    tags: ["Vitals", "Contactless", "Diagnostics"],
    externalUrl: "https://example.com/shop/infrared-thermometer"
  }
];

export default function ShopPage() {
  const username = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<string>("featured");
  
  // Dialog state for product detail view
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Categories list
  const categories = ["All", "Equipment", "Disposables", "Diagnostics"];

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = [...PRODUCTS_DATA];
    
    // Category filter
    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Search filter
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) || 
        p.description.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "stock") {
      result.sort((a, b) => b.stock - a.stock);
    }
    
    return result;
  }, [searchTerm, selectedCategory, sortBy]);

  // Open product link in dummy website
  const handleShopRedirect = (productName: string, externalUrl: string) => {
    toast.info(`Redirecting you to internal partner website to buy ${productName}...`);
    setTimeout(() => {
      window.open(externalUrl, "_blank");
    }, 600);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      
      {/* Upper Store Banner */}
      <div className="relative rounded-2xl overflow-hidden shadow-md">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-indigo-600 to-indigo-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/30"></div>
        
        {/* Banner Content */}
        <div className="relative z-10 p-6 sm:p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl text-white space-y-2">
            <Badge className="bg-white/20 text-white border-0 hover:bg-white/30 backdrop-blur-md px-3 py-1 font-semibold text-xs rounded-full">
              Partner Supply Catalog
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white m-0">
              Clinic Medical Supplies & Shop
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed font-medium">
              Browse medical machinery, disposables, and diagnostic devices. Click Shop on any item to order directly from our partner logistics portal.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="grid gap-4 md:flex md:items-center md:justify-between bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        
        {/* Category filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const count = cat === "All" 
              ? PRODUCTS_DATA.length 
              : PRODUCTS_DATA.filter(p => p.category === cat).length;
            
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`}
              >
                {cat}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedCategory === cat ? "bg-white/20 text-white" : "bg-slate-200 text-slate-500"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row gap-3 md:w-auto md:max-w-md shrink-0">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search supplies, wheelchair, syringe..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 w-full bg-slate-50 border-slate-200 focus-visible:ring-blue-600 text-sm placeholder:text-slate-400"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <div className="relative shrink-0">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="pl-9 pr-8 py-2 h-10 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600 appearance-none cursor-pointer"
            >
              <option value="featured">Sort by: Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Rating: High to Low</option>
              <option value="stock">Stock Available</option>
            </select>
          </div>
        </div>

      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/60 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
          <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Search className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-800">No medical supplies found</h3>
            <p className="text-sm text-slate-500">
              We couldn't find any products matching "{searchTerm}". Try checking your spelling or selecting a different category.
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => { setSearchTerm(""); setSelectedCategory("All"); }}
            className="mt-2 text-xs font-semibold text-slate-700 cursor-pointer"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => {
            const IconComponent = product.icon;
            
            return (
              <Card 
                key={product.id} 
                className="group relative flex flex-col justify-between overflow-hidden border-slate-200/60 hover:border-blue-400 hover:shadow-lg transition-all duration-300 bg-white"
              >
                <div>
                  {/* Category Badge & Stock */}
                  <div className="flex items-center justify-between p-4 pb-2">
                    <Badge className={`border-0 font-bold text-[10px] uppercase px-2 py-0.5 rounded-md ${
                      product.category === "Equipment" ? "bg-indigo-50 text-indigo-700" :
                      product.category === "Disposables" ? "bg-amber-50 text-amber-700" :
                      "bg-emerald-50 text-emerald-700"
                    }`}>
                      {product.category}
                    </Badge>
                    <span className="text-xs font-bold text-slate-500">
                      {product.stock} units
                    </span>
                  </div>

                  {/* Graphic Product Box */}
                  <div className="mx-4 my-2 h-44 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-6 transition-all group-hover:bg-slate-100 relative overflow-hidden">
                    <div className="h-28 w-28 drop-shadow-md transform group-hover:scale-110 transition-transform duration-300">
                      <IconComponent />
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                      <span className="text-[10px] text-slate-400">| Quality Checked</span>
                    </div>

                    <h3 className="font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8">
                      {product.description}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {product.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <CardFooter className="p-4 pt-0 border-t border-slate-50 bg-slate-50/50 flex flex-col gap-2">
                  <div className="flex items-baseline justify-between w-full pt-3">
                    <span className="text-[11px] text-slate-400 font-semibold uppercase">Partner Price</span>
                    <span className="text-lg font-black text-slate-800">${product.price.toFixed(2)}</span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 w-full pt-1">
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedProduct(product)}
                      className="col-span-2 h-9 border-slate-200 text-slate-600 hover:text-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Details
                    </Button>
                    
                    <Button 
                      onClick={() => handleShopRedirect(product.name, product.externalUrl)}
                      className="col-span-3 h-9 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm rounded-lg cursor-pointer flex items-center justify-center gap-1.5 group/btn"
                    >
                      Shop
                      <ExternalLink className="h-3.5 w-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Product Details Modal */}
      <Dialog open={selectedProduct !== null} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        {selectedProduct && (
          <DialogContent className="max-w-2xl bg-white border border-slate-200/80 rounded-2xl shadow-xl p-0 overflow-hidden">
            <div className="flex flex-col md:flex-row h-full">
              
              {/* Product Visual Container */}
              <div className="md:w-1/2 bg-slate-50 p-6 flex flex-col justify-between items-center border-b md:border-b-0 md:border-r border-slate-100">
                <div className="flex justify-between w-full">
                  <Badge className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] py-1 px-2.5 rounded-full border-0 uppercase">
                    {selectedProduct.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    <span className="text-xs font-bold text-slate-700">{selectedProduct.rating}</span>
                  </div>
                </div>
                
                <div className="h-44 w-44 my-8 drop-shadow-lg">
                  {(() => {
                    const ProductIcon = selectedProduct.icon;
                    return <ProductIcon />;
                  })()}
                </div>

                <div className="w-full space-y-2 text-center md:text-left bg-white p-3 rounded-lg border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Manufacturer</span>
                  <span className="text-xs font-bold text-slate-700 block">{selectedProduct.manufacturer}</span>
                </div>
              </div>

              {/* Product Specs Container */}
              <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-5">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-800 tracking-tight leading-tight m-0">
                      {selectedProduct.name}
                    </h2>
                    <span className="text-xs text-slate-400 font-semibold mt-1 block">ID: {selectedProduct.id}</span>
                  </div>
                  
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-slate-800">${selectedProduct.price.toFixed(2)}</span>
                  </div>

                  <Separator className="bg-slate-100" />
                  
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Product Features</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">
                      {selectedProduct.description}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Technical Specs</h4>
                    <ul className="space-y-1.5 list-none p-0 m-0">
                      {selectedProduct.specs.map((spec, i) => (
                        <li key={i} className="text-[11px] font-semibold text-slate-500 flex items-start gap-1.5 leading-normal">
                          <Check className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="leading-tight">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Stock Status</span>
                    <span className="text-xs font-bold text-emerald-600">
                      Available to order
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedProduct(null)}
                      className="h-10 text-xs font-bold text-slate-600 border-slate-200 rounded-lg cursor-pointer"
                    >
                      Close
                    </Button>
                    <Button 
                      onClick={() => {
                        handleShopRedirect(selectedProduct.name, selectedProduct.externalUrl);
                        setSelectedProduct(null);
                      }}
                      className="h-10 px-5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md rounded-lg cursor-pointer flex items-center gap-1.5"
                    >
                      Shop
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

              </div>

            </div>
          </DialogContent>
        )}
      </Dialog>

    </div>
  );
}
