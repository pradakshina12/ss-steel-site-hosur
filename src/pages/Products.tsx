
import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Products = () => {
  const [activeTab, setActiveTab] = useState("structural");

  const structuralProducts = [
    {
      name: "Angles",
      description: "Steel angles for construction and fabrication frameworks.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    },
    {
      name: "Channels",
      description: "U-shaped structural steel for construction applications.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
    },
    {
      name: "Flats",
      description: "Flat steel bars available in various dimensions.",
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b"
    },
    {
      name: "I Beams",
      description: "Heavy-duty beams for structural support in construction.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625"
    },
    {
      name: "Square Rods",
      description: "Square steel rods for industrial applications.",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544"
    },
    {
      name: "Round Rods",
      description: "Circular steel rods for various construction needs.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
    },
    {
      name: "Bright Bars",
      description: "High-quality bright steel bars for precision engineering.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    },
    {
      name: "TMT Bars",
      description: "Thermo-Mechanically Treated bars for concrete reinforcement.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
    },
    {
      name: "Weld Mesh",
      description: "Welded wire mesh for reinforcement and fencing.",
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b"
    }
  ];

  const pipeProducts = [
    {
      name: "MS Round Pipes",
      description: "Mild steel round pipes for various applications.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625"
    },
    {
      name: "MS Square Pipes",
      description: "Mild steel square pipes for construction and fabrication.",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544"
    },
    {
      name: "MS Rectangle Pipes",
      description: "Mild steel rectangular pipes for structural applications.",
      image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1"
    },
    {
      name: "GI Pipes",
      description: "Galvanized iron pipes for water distribution and plumbing.",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475"
    }
  ];

  const sheetProducts = [
    {
      name: "HR Sheets / Plates",
      description: "Hot rolled steel sheets and plates for industrial applications.",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
    },
    {
      name: "CR / GI Sheets",
      description: "Cold rolled and galvanized iron sheets for various uses.",
      image: "https://images.unsplash.com/photo-1493397212122-2b85dda8106b"
    },
    {
      name: "Roofing Sheets",
      description: "Durable steel sheets for roofing applications.",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625"
    },
    {
      name: "Chequered Sheets",
      description: "Anti-slip steel sheets with raised pattern for flooring.",
      image: "https://images.unsplash.com/photo-1486718448742-163732cd1544"
    }
  ];

  return (
    <div>
      <div className="bg-blue text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Our Products</h1>
          <p className="max-w-3xl mx-auto text-lg">
            Quality steel products for construction and industrial applications
          </p>
        </div>
      </div>

      <div className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <Tabs 
            defaultValue="structural" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="w-full"
            id={activeTab}
          >
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="structural" id="structural">Structural Materials</TabsTrigger>
                <TabsTrigger value="pipes" id="pipes">Steel Pipes</TabsTrigger>
                <TabsTrigger value="sheets" id="sheets">Sheets & Plates</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="structural">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-steel-dark">Structural Materials</h2>
                <p className="text-steel mb-6">
                  Our comprehensive range of structural steel materials caters to various construction and fabrication needs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {structuralProducts.map((product, index) => (
                    <ProductCard 
                      key={index}
                      name={product.name}
                      description={product.description}
                      image={product.image}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="pipes">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-steel-dark">Steel Pipes</h2>
                <p className="text-steel mb-6">
                  We offer a wide selection of steel pipes for industrial, construction, and plumbing applications.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pipeProducts.map((product, index) => (
                    <ProductCard 
                      key={index}
                      name={product.name}
                      description={product.description}
                      image={product.image}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="sheets">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-steel-dark">Sheets & Plates</h2>
                <p className="text-steel mb-6">
                  Our range of steel sheets and plates are available in various grades, thicknesses, and dimensions.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sheetProducts.map((product, index) => (
                    <ProductCard 
                      key={index}
                      name={product.name}
                      description={product.description}
                      image={product.image}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Products;
